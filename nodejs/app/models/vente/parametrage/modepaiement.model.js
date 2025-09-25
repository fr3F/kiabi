module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("modepaiement", {
        designation: {
            type: Sequelize.STRING(45),
        },
        codesage: {
            type: Sequelize.STRING(45),
        },
        type: {
            type: Sequelize.STRING(45),
        },
        dateModification: {
            type: Sequelize.DATE
        },
        codejournal: {
            type: Sequelize.STRING(45)
        },
        noreglement: {
            type: Sequelize.INTEGER
        },
        magasin: {
            type: Sequelize.STRING(45)
        },
        financingType: {
            type: Sequelize.STRING(3)
        }
    },
    {
        tableName: "modepaiement",
        timestamps: false
    }
    );

    return Resp;
};
