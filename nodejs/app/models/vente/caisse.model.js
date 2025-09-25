module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("caisses", {
        nocaisse: {
            type: Sequelize.STRING(50),
        },
        adresseIp: {
            type: Sequelize.STRING(30),
        },
        port:  {
            type: Sequelize.STRING(5),
        },
        nomBdd: {
            type: Sequelize.STRING(50)
        },
        count: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.INTEGER, // 1: Nouveau, 2: Installé
        },
        dateInstallation: {
            type: Sequelize.DATE
        },
        usernameBdd: {
            type: Sequelize.STRING(50)
        },
        passwordBdd: {
            type: Sequelize.STRING(50)
        },
        connected: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    return Resp;
};
