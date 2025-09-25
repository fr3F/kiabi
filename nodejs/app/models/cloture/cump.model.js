module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("cump", {
        idcump: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        code: {
            type: Sequelize.STRING(18),
        },
        depot: {
            type: Sequelize.STRING(35),
        },
        cump: {
            type: Sequelize.DOUBLE,
        },
    },
    {
        tableName: "cump",
        timestamps: false
    }
    );

    return Resp;
};
