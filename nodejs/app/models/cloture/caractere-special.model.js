module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("caractere_speciaux", {
        special: {
            type: Sequelize.STRING(50),
        },
        remplacement: {
            type: Sequelize.STRING(50),
        },
    },
    {
        tableName: "caractere_speciaux",
        timestamps: false
    }
    );

    return Resp;
};
