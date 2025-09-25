const {
  setHeaderResponseAttachementExcel,
} = require("../../../helpers/excel.helper");
const inventaireService = require("../services/inventaire.service");
const inventaireExcelService = require("../services/inventaireExcel.service");

const InventaireSurplusService = require("../services/inventaireSurplus.service");

const service = new InventaireSurplusService();

class InventaireController {
  async create(req, res) {
    try {
      const inventaire = await inventaireService.createInventaire(req.body);
      res.status(201).json(inventaire);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async list(req, res) {
    try {
      const inventaires = await inventaireService.getAllInventaires();
      res.json(inventaires);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async detail(req, res) {
    try {
      const id = req.params.id;
      const inventaire = await inventaireService.getInventaireById(id);
      res.json(inventaire);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // controllers/inventaire.controller.js
  async addComptages(req, res) {
    try {
      const idinventaire = parseInt(req.params.id, 10); // forcer entier
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
      console.error(err);
      res.status(500).json({
        error: err.message || "Erreur lors de l'insertion des comptages",
      });
    }
  }

  //   async detailWithCountInventaire(req, res) {
  //     try {
  //       const id = req.params.id;
  //       const data = await inventaireService.getSnapshotWithCount(id);
  //       res.json(data);
  //     } catch (err) {
  //       res.status(500).json({ error: err.message });
  //     }
  //   }

  // Controller
  async getDetailInventaire(req, res) {
    try {
      const { idinventaire } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || "";

      const data = await inventaireService.getInventaireDetail({
        idinventaire,
        page,
        limit,
        search,
      });

      // Retourner total pour pagination
      res.json({
        data,
        total: data.length, // ou calculer total réel si besoin
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération du détail inventaire" });
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
      console.error(err);
      res.status(500).json({ error: "Erreur lors de l'export Excel" });
    }
  }

  /** Supprimer Inventaire */
  async delete(req, res) {
    try {
      const { idinventaire } = req.params;
      await inventaireService.deleteInventaire(idinventaire);
      res.status(200).json({ message: "Snapshot supprimé avec succès" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du snapshot", error });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { datedebut, datefin, status } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Id requis" });
      }

      const result = await inventaireService.update(id, { datedebut, datefin, status });
      console.log("Résultat update:", result);

      // Cas où l’ID n’existe pas
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Inventaire non trouvé" });
      }

      // Recharger toujours l’inventaire après update
      const updatedInventaire = await inventaireService.findByPk(id);

      if (!updatedInventaire) {
        return res.status(404).json({ message: "Inventaire non trouvé" });
      }

      return res.status(200).json(updatedInventaire);
    } catch (error) {
      console.error("Erreur update inventaire:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour", error });
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
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
      }
    }

  async getProgress(req, res) {
    try {
      const { idinventaire } = req.params;
      const result = await inventaireService.calculerProgressInventaire(idinventaire);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors du calcul de la progression" });
    }
  }

 async getSurplusNegatif(req, res) {
 try {
    // Récupérer idinventaire depuis query ou params
    const idinventaire = req.query.idinventaire || req.params.id;

    const data = await inventaireService.getSurplusNegatif(idinventaire || null);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des inventaires avec surplus négatif"
    });
  }
};


async getIntrouvablesController  (req, res) {
    const idinventaire = parseInt(req.params.idinventaire);

    if (isNaN(idinventaire)) {
      return res.status(400).json({ success: false, message: "idinventaire invalide" });
    }

    try {
      const data = await inventaireService.getIntrouvables(idinventaire);
      res.json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };


async getInventaireSummary  (req,  res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "ID inventaire requis" });

    // Exécuter les trois appels en parallèle
    const [totalAbsent, totalSurplus, progress] = await Promise.all([
      service.getIntrouvable(id),
      service.surplusTotal(id),
      inventaireService.calculerProgressInventaire(id)
    ]);

    res.json({
      totalAbsent,
      totalSurplus,
      progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération du résumé" });
  }
};

}

module.exports = new InventaireController();
