module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("utilisateurs", {
        login: {
            type: Sequelize.STRING(255),
            unique: true,
        },
        motdepasse: {
            type: Sequelize.STRING(255),
        },
        profile: {
            type: Sequelize.STRING(255),
        },
        nom: {
            type: Sequelize.STRING(255),
        },
        prenom: {
            type: Sequelize.STRING(255),
        },
        desactivate: {
            type: Sequelize.BOOLEAN,
            default: false
        },        
        dateModification: {
            type: Sequelize.DATE
        },
        
    },
    {
        tableName: "utilisateurs",
    }
    );

    return Resp;
};
