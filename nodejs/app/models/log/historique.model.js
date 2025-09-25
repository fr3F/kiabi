module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("historiques", {
        description: {
            type: Sequelize.TEXT,
        },
        utilisateur: {
            type: Sequelize.STRING(100),
        },
    });

    return Role;
};
