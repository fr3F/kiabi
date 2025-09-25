module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("articleticket", {
        idarticleticket: {
            type: Sequelize.INTEGER,
            primaryKey: true        
        },
        noligne: {
            type: Sequelize.INTEGER,
        },
        code: {
            type: Sequelize.STRING(18),
        },
        designation: {
            type: Sequelize.STRING(20),
        },
        prixdevente: {
            type: Sequelize.DOUBLE,
        },
        quantite: {
            type: Sequelize.DOUBLE,
        },
        prixtotal: {
            type: Sequelize.DOUBLE,
        },
        montantremise: {
            type: Sequelize.DOUBLE,
        },
        gamme: {
            type: Sequelize.STRING(45),
        },
        articlelocaux: {
            type: Sequelize.INTEGER,
        },
        codecategorie: {
            type: Sequelize.STRING(3),
        },
        codegamme: {
            type: Sequelize.STRING(3),
        },
        codeunivers: {
            type: Sequelize.STRING(3),
        },
        codegifi: {
            type: Sequelize.STRING(13),
        },
        libellecourt: {
            type: Sequelize.STRING(20),
        },
        tauxtva: {
            type: Sequelize.INTEGER,
        },
        numerodeserie: {
            type: Sequelize.STRING(45),
        },
        codeean: {
            type: Sequelize.STRING(45),
        },
        returnReason: {
            type: Sequelize.INTEGER(1),
            allowNull: true
        },
        origTransactionType: {
            type: Sequelize.STRING(3),
            allowNull: true
        }
    },
    {
        tableName: "articleticket",
    }
    );

    return Resp;
};
