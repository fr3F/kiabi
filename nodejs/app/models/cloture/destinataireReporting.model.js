module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("destinataire_reporting", {
        email: {
            type: Sequelize.STRING(75),
        },
    },
    {
        tableName: "destinataire_reporting",
        timestamps: false
    }
    );

    return Resp;
};
