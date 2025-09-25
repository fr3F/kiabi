module.exports = (sequelize, Sequelize) => {
    const InventaireComptage = sequelize.define('inventaire_comptage', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idinventaire: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        epc: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        eanCode: {
            type: Sequelize.STRING(13),
            allowNull: true
        },
        datemodification: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: 'inventaire_comptage',
        timestamps: false
    });

    return InventaireComptage;
};
