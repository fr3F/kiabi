const InventaireSnapshotService = require("../services/inventaireSnapshot.service");

const InventaireSnapshotController = {

    /** Lister tous les snapshots d’un inventaire */
    listByInventaire: async (req, res) => {
        try {
            const { idinventaire } = req.params;
            const snapshots = await InventaireSnapshotService.listSnapshotsByInventaire(idinventaire);
            res.status(200).json(snapshots);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des snapshots", error });
        }
    },  

    /** Détail d’un snapshot */
    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const snapshot = await InventaireSnapshotService.getSnapshotById(id);
            if (!snapshot) return res.status(404).json({ message: "Snapshot non trouvé" });
            res.status(200).json(snapshot);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération du snapshot", error });
        }
    },

    /** Mettre à jour un snapshot */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await InventaireSnapshotService.updateSnapshot(id, data);
            res.status(200).json({ message: "Snapshot mis à jour avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du snapshot", error });
        }
    },



};


module.exports = InventaireSnapshotController;
