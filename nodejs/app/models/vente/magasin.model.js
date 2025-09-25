module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("magasin", {
        nommagasin: {
            type: Sequelize.STRING(45),
        },
        code: {
            type: Sequelize.STRING(45),
        },
        minicentrale: {
            type: Sequelize.STRING(45),
        },
        nummagasin: {
            type: Sequelize.STRING(45),
        },
        depotstockage: {
            type: Sequelize.STRING(35),
        },
        depotlivraison: {
            type: Sequelize.STRING(35),
        },
        souche: {
            type: Sequelize.INTEGER,
        },
        lastnumfact: {
            type: Sequelize.STRING(35),
        },
        numdepot: {
            type: Sequelize.INTEGER,
        },
        lastnumreglement: {
            type: Sequelize.STRING(35),
        },
        identifiant: {
            type: Sequelize.STRING(45),
        },
        dateModification: {
            type: Sequelize.DATE
        },
        gifi: {
            type: Sequelize.BOOLEAN
        },
        dateDernierAppro:{
            type: Sequelize.DATE
        },
        telephone: {
            type: Sequelize.STRING(45),
        },
        facebook: {
            type: Sequelize.STRING(45),
        },
        siteweb: {
            type: Sequelize.STRING(45),
        },
        horaireouvrable: {
            type: Sequelize.TEXT,
        },
        horaireweek: {
            type: Sequelize.STRING(45),
        },
        logo: {
            type: Sequelize.STRING(100)
        },
        nbChiffreNumFacture: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 6
        },
        devise: {
            type: Sequelize.STRING(15)
        },
        monnaies: {
            type: Sequelize.TEXT
        },
        clotureCaisse: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        storeCode: {
            type: Sequelize.STRING(3),
            allowNull: true
        },
        brn: {
            type: Sequelize.STRING(45)
        },
        vat: {
            type: Sequelize.STRING(45)
        },
        instagram: {
            type: Sequelize.STRING(45)
        }, 
        nomBase: {
            type: Sequelize.STRING(45)
        }
    },
    {
        tableName: "magasin"
    }
    );

    return Resp;
};
