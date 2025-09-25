const { sequelize } = require("../../../models");

const InventaireSnapshotService = {



    /** Lister tous les snapshots d’un inventaire */
    listSnapshotsByInventaire: async (idinventaire) => {
        const query = `
            SELECT * FROM inventaire_snapshot
            WHERE idinventaire = :idinventaire
            ORDER BY id DESC
        `;
        const [result] = await sequelize.query(query, { replacements: { idinventaire } });
        return result;
    },

    /** Détail d’un snapshot */
    getSnapshotById: async (id) => {
        const query = `
            SELECT * FROM inventaire_snapshot
            WHERE id = :id
        `;
        const [result] = await sequelize.query(query, { replacements: { id } });
        return result[0];
    },

    /** Mettre à jour un snapshot */
    updateSnapshot: async (id, data) => {
        const query = `
            UPDATE inventaire_snapshot
            SET eanCode = :eanCode,
                stock = :stock,
                color = :color,
                size = :size,
                styleCode = :styleCode,
                designation = :designation
            WHERE id = :id
        `;
        return sequelize.query(query, { replacements: { ...data, id } });
    },


};

module.exports = InventaireSnapshotService;
