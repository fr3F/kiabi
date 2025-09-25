module.exports = (sequelize, Sequelize) => {
    const rep = sequelize.define("menu_role", {},
    {
        timestamps: false,
        tableName: "menu_roles"
    });

    return rep;
};
