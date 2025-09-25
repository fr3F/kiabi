import { checkMongoConnection } from "../../../config/environments/mongo/db_mongo.config.js";
import Produit from "../../../models/rfid/Produit.js";

async function getTags() {
  checkMongoConnection();
  return await Produit.find({ status: "detected" }).sort({ date: -1 });
}
async function getProductsByUIDs(uids) {
  checkMongoConnection();
  return await Produit.find({ uid: { $in: uids } });
}

async function updateProductStatus(product) {
  checkMongoConnection();
  product.location = "rayon";
  product.status = "detected";
  await product.save();

  console.log(`Produit mis à jour : UID=${product.uid}, model=${product.model}, size=${product.size}`);
  return product;
}
async function createNewProduct(uid) {
  checkMongoConnection();
  const newProduct = await Produit.create({
    uid,
    model: "UNKNOWN",
    size: "UNKNOWN",
    color: "UNKNOWN",
    location: "rayon",
    status: "detected"
  });

  console.log(`Nouveau produit ajouté : UID=${uid}`);
  return newProduct;
}

async function getLastTagByUID(uid) {  
  checkMongoConnection();
  return await Produit.findOne({ uid });
}

async function fetchSizeAggregation() {
  return await Produit.aggregate([
    { $match: { location: 'rayon' } },
    {
      $group: {
        _id: { model: "$model", size: "$size" },
        count: { $sum: 1 }
      }
    }
  ]);
}

function groupSizesByModel(aggregation) {
  const grouped = {};
  aggregation.forEach(({ _id: { model, size } }) => {
    if (!grouped[model]) grouped[model] = new Set();
    grouped[model].add(size);
  });
  return grouped;
}

//  Identifie les tailles manquantes pour chaque modèle.
function getMissingSizesByModel(grouped) {
  const EXPECTED_SIZES = ['S', 'M', 'L', 'XL'];
  return Object.entries(grouped).map(([model, sizes]) => ({
    model,
    missingSizes: EXPECTED_SIZES.filter(size => !sizes.has(size))
  }));
}

// les tailles manquantes par modèle.
async function initGetMissingSizesByModel(){
  checkMongoConnection();
  const aggregation = await fetchSizeAggregation();
  const grouped = groupSizesByModel(aggregation);
  return getMissingSizesByModel(grouped);

}

export {
  getTags,
  getLastTagByUID,
  createNewProduct,
  updateProductStatus,
  initGetMissingSizesByModel,
  getProductsByUIDs
};