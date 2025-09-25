module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("fonctionnalite", {
        nom: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        type: {
            type: Sequelize.STRING(50),
            // allowNull: false
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['moduleId', 'nom'],
            }
        ],
        timestamps: false
    });

    return Resp;
};
