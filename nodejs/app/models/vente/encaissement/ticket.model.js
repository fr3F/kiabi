module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("ticket", {
        idticket: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true        
        },
        datecreation: {
            type: Sequelize.DATE
        },
        nocaisse: {
            type: Sequelize.STRING(45),
        },
        namecaissier: {
            type: Sequelize.STRING(45),
        },
        montanttotal: {
            type: Sequelize.DOUBLE
        },
        nbarticle: {
            type: Sequelize.INTEGER,
        },
        montantht: {
            type: Sequelize.DOUBLE
        },
        montanttva: {
            type: Sequelize.DOUBLE
        },
        modepaiement: {
            type: Sequelize.STRING(45),
        },
        codeclient: {
            type: Sequelize.STRING(45),
        },
        recu: {
            type: Sequelize.DOUBLE
        },
        arendre: {
            type: Sequelize.DOUBLE
        },
        magasin: {
            type: Sequelize.STRING(45),
        },
        numticket: {
            type: Sequelize.STRING(45),
        },
        montantremise: {
            type: Sequelize.DOUBLE
        },
        numerocheque: {
            type: Sequelize.STRING(45),
        },
        isclos: {
            type: Sequelize.INTEGER,
        },
        codejournal: {
            type: Sequelize.STRING(45),
        },
        nomodereglement: {
            type: Sequelize.INTEGER,
        },
        depot: {
            type: Sequelize.STRING(45),
        },
        numeroFacture: {
            type: Sequelize.STRING(13),
        },
        ventedepot: {
            type: Sequelize.INTEGER(1),
            defaultValue: 0
        },
        clientvip: {
            type: Sequelize.STRING(45)
        },
        hash: {
            type: Sequelize.STRING(50)
        },
        duration: {
            type: Sequelize.INTEGER
        },
        storeCode: {
            type: Sequelize.STRING(3),
            allowNull: true
        }
    },
    {
        tableName: "ticket",
    }
    );

    return Resp;
};
