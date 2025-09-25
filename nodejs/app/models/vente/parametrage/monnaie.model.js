module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("monnaies", {
        libelle: {
            type: Sequelize.STRING(20),
            unique: true
        },
        valeur: {
            type: Sequelize.DOUBLE
        }
    },
    {
        tableName: "monnaies",
        timestamps: false
    });

    return Resp;
};
