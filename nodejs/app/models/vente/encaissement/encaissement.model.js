module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("encaissement", {
        idencaissement: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true        
        },
        idcaissier: {
            type: Sequelize.INTEGER,
        },
        magasin: {
            type: Sequelize.STRING(45),
        },
        nocaisse: {
            type: Sequelize.STRING(45),
        },
        statut: {
            type: Sequelize.STRING(45),
        },
        createdAt: {
            type: Sequelize.DATE
        },
        endAt: {
            type: Sequelize.DATE
        },
        fonddecaisse: {
            type: Sequelize.DOUBLE
        },
        contenucaisse: {
            type: Sequelize.DOUBLE
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        send: {
            type: Sequelize.INTEGER,
        },
        especeRecu: {
            type: Sequelize.DOUBLE,
        },
        dateValidation: {
            type: Sequelize.DATE
        },        
        motifEcart: {
            type: Sequelize.TEXT,
        },
        ecart: {
            type: Sequelize.DOUBLE,
        },
    },
    {
        tableName: "encaissement",
        timestamps: false
    }
    );

    return Resp;
};
