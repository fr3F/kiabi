const {
  setHeaderResponseAttachementExcel,
} = require("../../helpers/excel.helper");
const { sendError } = require("../../helpers/helpers.helper");
const inventaireService = require("./services/inventaire.service");
const inventaireExcelService = require("./services/inventaireExcel.service");

const InventaireSurplusService = require("./services/inventaireSurplus.service");

const service = new InventaireSurplusService();

class InventaireController {

  async listInventaire(req, res) {
    try {
      const inventaires = await inventaireService.getAllInventaires();
      res.json(inventaires);
    } catch (err) {
     sendError(res,err)
    }
  }

  async deleteInventaire(req, res) {
    try {
      const { idinventaire } = req.params;
      await inventaireService.deleteInventaire(idinventaire);
      res.status(200).json({ message: "Snapshot supprimé avec succès" });
    } catch (err) {
     sendError(res,err)
    }
  }

  async updateInventaire(req, res) {
    try {
      const { id } = req.params;
      const { datedebut, datefin, status } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Id requis" });
      }

      const result = await inventaireService.updateInventaire(id, { datedebut, datefin, status });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Inventaire non trouvé" });
      }

      const updatedInventaire = await inventaireService.findByPk(id);

      if (!updatedInventaire) {
        return res.status(404).json({ message: "Inventaire non trouvé" });
      }

      return res.status(200).json(updatedInventaire);
    } catch (err) {
      sendError(res,err)
    }
  }

  async getInventaireById(req, res) {
    try {
      const id = req.params.id;
      const inventaire = await inventaireService.getInventaireById(id);
      res.json(inventaire);
    } catch (err) {
      sendError(res,err)
    }
  }

  async createInventaire(req, res) {
      try {
        const { datedebut, datefin, status } = req.body;

        if (!datedebut || !status) {
          return res.status(400).json({ message: "datedebut et status requis" });
        }

        const result = await inventaireService.createInventaireWithSnapshot({
          datedebut,
          datefin,
          status
        });

        return res.status(201).json(result);
      } catch (err) {
        sendError(res,err)
      }
  }
  
  async addComptages(req, res) {
    try {
      const idinventaire = parseInt(req.params.id, 10);
      const { items } = req.body;

      if (isNaN(idinventaire)) {
        return res.status(400).json({ error: "idinventaire invalide" });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({
            error: "Format invalide : items doit être un tableau non vide",
          });
      }

      const comptages = await inventaireService.addComptages(
        idinventaire,
        items
      );

      res.status(201).json({
        message: "Comptages insérés avec succès",
        data: comptages,
      });
    } catch (err) {
        sendError(res,err)
    }
  }

  async getDetailInventaire(req, res) {
    try {
      const { idinventaire } = req.params;
      
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || "";

      const dataPage = await inventaireService.getInventaireDetail({ idinventaire, page, limit, search });
      const totalItems = await inventaireService.countInventaireDetail({ idinventaire });

      res.json({
        data: dataPage,
        total: totalItems,
      });
    } catch (err) {
      sendError(res, err);
    }
  }


  async exportExcel(req, res) {
    try {
      const { idinventaire } = req.params;
      const { search } = req.query;

      const workbook = await inventaireExcelService.generateExcel(
        idinventaire,
        search || ""
      );

      setHeaderResponseAttachementExcel(res, `inventaire_${idinventaire}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
        sendError(res,err)
    }
  }

  async getSurplusListes(req, res) {
    try {
      const idinventaire = req.params.id;

      const data = await inventaireService.getSurplusListes(idinventaire);

      res.json({
        success: true,
        data
      });
    } catch (err) {
      sendError(res,err)
    }
  }

  async getIntrouvablesListes (req, res) {
      const idinventaire = parseInt(req.params.idinventaire);

      if (isNaN(idinventaire)) {
        return res.status(400).json({ success: false, message: "idinventaire invalide" });
      }

      try {
        const data = await inventaireService.getIntrouvablesListes(idinventaire);
        res.json({ success: true, data });
      } catch (err) {
        sendError(res,err)
      }
  };

  async getInventaireSummary(req, res) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return res.status(400).json({ message: "ID inventaire requis" });
      }

      const summary = await service.initial(id);

      res.send(summary);
    } catch (err) {
        sendError(res,err)
    }
  };

}

module.exports = new InventaireController();
