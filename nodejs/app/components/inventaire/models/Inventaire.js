module.exports = (sequelize, Sequelize) => {
    const Inventaire = sequelize.define('inventaire', {
        idinventaire: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        datedebut: {
            type: Sequelize.DATE,
            allowNull: true
        },
        datefin: {
            type: Sequelize.DATE,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING(45),
            allowNull: true
        }
    }, {
        tableName: 'inventaire',
        timestamps: false
    });

    return Inventaire;
};
