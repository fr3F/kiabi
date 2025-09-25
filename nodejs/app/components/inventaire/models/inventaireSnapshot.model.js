module.exports = (sequelize, Sequelize) => {
    const InventaireSnapshot = sequelize.define('inventaire_snapshot', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idinventaire: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        eanCode: {
            type: Sequelize.STRING(13),
            allowNull: true
        },
        stock: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        datesnapshot: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        color: {
            type: Sequelize.STRING(40),
            allowNull: true
        },
        size: {
            type: Sequelize.STRING(14),
            allowNull: true
        },
        styleCode: {
            type: Sequelize.STRING(5),
            allowNull: true
        },
        designation: {
            type: Sequelize.STRING(30),
            allowNull: true
        }
    }, {
        tableName: 'inventaire_snapshot',
        timestamps: false
    });

    return InventaireSnapshot;
};
