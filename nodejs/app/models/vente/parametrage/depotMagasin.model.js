module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("depot_magasins", {
    },
    {
        tableName: "depot_magasins",
        timestamps: false
    });

    return Resp;
};
