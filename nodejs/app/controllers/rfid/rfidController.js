import {postTags } from '../../services/rfid/reader.service.js';
import { getLastTagByUID, getTags, initGetMissingSizesByModel } from '../../services/rfid/util/rfid.js';

// Liste des produits détectés récemment
async function getAllDetectedProducts(res, next) {
    try {
        const tags = await getTags();
        if (!tags || tags.length === 0) {
            return res.status(404).json({ message: "No tags found" });
        }
        res.json(tags);
    } catch (error) {
        next(error);
    }
}
async function postTag(req, res, next) {
    try {
        const { uid } = req.body;
        if (!uid) {
            return res.status(400).json({ message: "UID is required" });
        }
        const newtag = await postTags(uid);
        res.status(200).json(newtag);
    } catch (error) {
        next(error);
    }
}

async function getMissingSizes(res) {
  try {
    const missing = initGetMissingSizesByModel();
    res.json(missing);
  } catch (error) {
    console.error("Erreur lors du calcul des tailles manquantes:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

async function markProductAsSold(req, res, next) {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ message: "UID is required" });
    }
    const product = await getLastTagByUID(uid);
    if (!product) {
      return res.status(404).json({ message: `Produit inconnu (UID=${uid})` });
    }
    product.statut = "vendu";
    product.location = "caisse";
    await product.save();

    console.log(`Produit marqué comme vendu : UID=${uid}`);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export { getAllDetectedProducts, postTag, getMissingSizes, markProductAsSold }; 