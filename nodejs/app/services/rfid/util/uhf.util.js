import { ReadlineParser, SerialPort } from "serialport";
import Product from "../../../models/rfid/Produit.js";

function createSerialPort(path, baudRate) {
  return new SerialPort({ path, baudRate });
}

function attachParser(port) {
  return port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
}

function setupDataListener(parser) {
  parser.on("data", async (data) => {
    const uid = data.trim();
    if (!uid) return;

    const product = await updateOrLogUnknownProduct(uid);
    logProductDetection(product, uid);
  });
}

function setupErrorListener(port) {
  port.on("error", (err) => {
    console.error("❌ Erreur port série UHF:", err.message);
  });
}

// 🔁 Logique MongoDB
async function updateOrLogUnknownProduct(uid) {
  return await Product.findOneAndUpdate(
    { uid },
    { location: "rayon", status: "detected", date: new Date() },
    { new: true }
  );
}

function logProductDetection(product, uid) {
  if (!product) {
    console.log("Produit inconnu:", uid);
    throw new Error("Produit inconnu");
  } else {
    console.log(`Produit détecté : UID=${uid}, modèle=${product.model}, taille=${product.size}`);
    throw new Error("Produit détecté");
  }
}

export  {
    createSerialPort,
    attachParser,
    setupDataListener,
    setupErrorListener,
    logProductDetection,
    updateOrLogUnknownProduct
}
