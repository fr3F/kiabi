module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("table_caisses", {
        dernierModification: {
            type: Sequelize.DATE,
        },
        idMax: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
    },
    {
        timestamps: false
    });

    return Resp;
};
