module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("logs_caisse", {
        level: {
            type: Sequelize.STRING(18)
        },
        message: {
            type: Sequelize.STRING(2048)
        },
        meta: {
            type: Sequelize.TEXT
        },
        timestamp: {
            type: Sequelize.DATE,
        }
    },
    {
        tableName: "logs_caisse",
        timestamps: false
    });

    return Resp;
};
