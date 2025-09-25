module.exports = (sequelize, Sequelize) => {
    const Prelevement = sequelize.define("prelevement", {
        idprelevement: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true        
        },
        datecreation: {
            type: Sequelize.DATE
        },
        montant: {
            type: Sequelize.DOUBLE
        },
        responsable: {
            type: Sequelize.TEXT
        },
    },
    {
        tableName: "prelevement",
        timestamps: false
    }
    );

    return Prelevement;
};
