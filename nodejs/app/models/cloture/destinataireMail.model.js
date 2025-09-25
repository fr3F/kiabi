module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("destinataire_mail", {
        email: {
            type: Sequelize.STRING(75),
        },
        type: {
            type: Sequelize.STRING(75), // NORMAL, TRANSFERT
            defaultValue: "NORMAL"
        },
    },
    {
        tableName: "destinataire_mail",
        timestamps: false
    }
    );

    return Resp;
};
