module.exports = (sequelize, Sequelize) => {
    const NotifMagasin = sequelize.define("notif_magasin", {
        email: {
            type: Sequelize.STRING(200)
        },
    },
    {
        tableName: "notif_magasin",
        timestamps: false
    });

    return NotifMagasin;
};
