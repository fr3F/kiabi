import net from "net";
import { logProductDetection, updateOrLogUnknownProduct } from "./uhf.util.js";
import { postTags } from "../reader.service.js";
import { getLastTagByUID, getProductsByUIDs } from "./rfid.js";
function createSocketConnection(host, port) {
  const socket = new net.Socket();

  socket.connect(port, host, () => {
    console.log(`Connecté au lecteur UHF via ${host}:${port}`);
  });
  return socket;
}

// Vérifie si le produit est vendu avant de le marquer comme volé
async function checkTheftAtExit(uids) {
  const products = await getProductsByUIDs(uids); 

  const alerts = [];

  for (const product of products) {
    if (product.statut !== "vendu") {
      // Produit détecté à la sortie mais pas payé
      const alertMsg = `ALERTE VOL POTENTIEL : Produit non payé détecté à la sortie. UID=${product.uid}, modèle=${product.model}, taille=${product.size}`;
      console.log(alertMsg);
      alerts.push(alertMsg);

      // Ici tu peux aussi déclencher une notification, alerte SMS, email, etc.
    }
  }

  if (alerts.length === 0) {
    console.log("Pas de produit volé détecté à la sortie.");
  }

  return alerts;
}

function setupSocketDataListener(socket, io) {
  socket.on("data", async (data) => {
    const uid = extractUIDFromRaw(data);
    if (!uid) return;

    await ensureTagExists(uid);
    const product = await handleProductDetection(uid, io);
    await handleTheftCheck(uid, product, io);
  });
}

// Vérifie si le tag existe, sinon le crée
async function ensureTagExists(uid) {
  const existingTag = await getLastTagByUID(uid);
  if (!existingTag) {
    await postTags(uid);
  }
}

// Gère la détection du produit
async function handleProductDetection(uid, io) {
  const product = await updateOrLogUnknownProduct(uid);
  logProductDetection(product, uid);

  io.emit("rfid-detected", {
    uid,
    product: product || null,
    message: product ? undefined : "Produit non trouvé dans la base."
  });

  return product;
}

// Gère la vérification de vol
async function handleTheftCheck(uid, product, io) {
  if (!product) return;

  const alerts = await checkTheftAtExit([uid]);
  for (const alert of alerts) {
    io.emit("theft-detected", {
      uid,
      message: alert
    });
  }
}

function setupSocketErrorListener(socket) {
  socket.on("error", (err) => {
    console.error("❌ Erreur socket UHF:", err.message);
  });

  socket.on("close", () => {
    console.warn("🔌 Connexion au lecteur UHF fermée.");
  });
}

// 🔍 Extraction simple, à adapter selon le protocole de ton lecteur
function extractUIDFromRaw(buffer) {
  const hex = buffer.toString("hex").toUpperCase().trim();
  // Simule extraction de l'EPC/UID (si toute la trame est le UID)
  if (hex.length >= 8) {
    return hex;
  }
  return null;
}

export {
  createSocketConnection,
  setupSocketDataListener,
  setupSocketErrorListener
};
