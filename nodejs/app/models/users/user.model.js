module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        // username: {
        //     type: Sequelize.STRING(50),
        // },
        email: {
            type: Sequelize.STRING(50),
        },
        motDePasse: {
            type: Sequelize.STRING,
        },
        active: {
            type: Sequelize.BOOLEAN,
        },
        nom: {
            type: Sequelize.STRING(50),
        },
        prenom: {
            type: Sequelize.STRING(50),
        },
        storeCode: {
            type: Sequelize.STRING(3)
        }
    });

    return User;
};
