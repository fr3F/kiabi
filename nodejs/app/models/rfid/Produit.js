// Produit.js
import mongoose from "mongoose";

const ProduitSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  model: String,
  size: String,
  location: { type: String, default: "rayon" },
  statut: { type: String, enum: ["detected", "vendu"], default: "detected" },
  detectedAt: { type: Date, default: Date.now }
});

const Produit = mongoose.model("Produit", ProduitSchema);

export default Produit;
