const InventaireSurplusService = require('../services/inventaireSurplus.service');
const service = new InventaireSurplusService();

class InventaireSurplusController {
  async getAbsentSnapshot(req, res) {
    try {
      const id = Number(req.params.idinventaire);
      const rows = await service.getSurplusNonExistant(id);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getOverStock(req, res) {
    try {
      const id = Number(req.params.idinventaire);
      const rows = await service.getOverStockWithTotal(id);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getIntrouvable(req, res) {
    try {
      const idinventaire = Number(req.params.idinventaire);
      if (isNaN(idinventaire)) {
        return res.status(400).json({ error: "idinventaire invalide" });
      }

      const totalIntrovable = await service.getIntrouvable(idinventaire);
      res.json({ totalIntrovable });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

module.exports = new InventaireSurplusController();
