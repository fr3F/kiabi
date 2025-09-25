module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("clientvip", {
        numClient: {
            type: Sequelize.STRING(10),
            unique: true
        },
        nom: {
            type: Sequelize.STRING(100),
        },
        prenom: {
            type: Sequelize.STRING(100),
        },
        adresse: {
            type: Sequelize.STRING(255),
        },
        code: {
            type: Sequelize.STRING(3),
        },
        ville: {
            type: Sequelize.STRING(50),
        },
        telephone: {
            type: Sequelize.STRING(30),
        },
        titre: {
            type: Sequelize.STRING(30),
        },
        adresse2: {
            type: Sequelize.STRING(100),
        },
        email: {
            type: Sequelize.STRING(100)
        },
        dateCreation: {
            type: Sequelize.DATEONLY
        },
        portable: {
            type: Sequelize.STRING(30),
        },
        dateAnniversaire: {
            type: Sequelize.DATEONLY
        },
        point: {
            type: Sequelize.DOUBLE
        },
        dernierAchat: {
            type: Sequelize.DATE
        },
        dateActivation: {
            type: Sequelize.DATE
        },
        dateExpiration: {
            type: Sequelize.DATE
        },
        moisValidation: {
            type: Sequelize.INTEGER
        },
        codeClient: {
            type: Sequelize.STRING(20),
            unique: true
        },
        optinSmsKiabi: {
            type: Sequelize.BOOLEAN
        },
        dateOptinSmsKiabi: {
            type: Sequelize.DATE
        },
        dateOptoutSmsKiabi: {
            type: Sequelize.DATE
        },
        optinSmsPartner: {
            type: Sequelize.BOOLEAN
        },
        dateOptinSmsPartner: {
            type: Sequelize.DATE
        },
        dateOptoutSmsPartner: {
            type: Sequelize.DATE
        },
        optinEmailKiabi: {
            type: Sequelize.BOOLEAN
        },
        dateOptinEmailKiabi: {
            type: Sequelize.DATE
        },
        dateOptoutEmailKiabi: {
            type: Sequelize.DATE
        },
        optinEmailPartner: {
            type: Sequelize.BOOLEAN
        },
        dateOptinEmailPartner: {
            type: Sequelize.DATE
        },
        dateOptoutEmailPartner: {
            type: Sequelize.DATE
        },
        storeCode: {
            type: Sequelize.STRING(3)
        }
    },
    {
        tableName: "clientvip",
        timestamps: true,
        updatedAt: 'dateModification'

    });

    return Resp;
}
