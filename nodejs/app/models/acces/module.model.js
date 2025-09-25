module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("module", {
        nom: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
    },
    {
        timestamps: false
    });

    return Resp;
};
