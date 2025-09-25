module.exports = (sequelize, Sequelize) => {
    const Activite = sequelize.define("menu", {
        label: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        icon: {
            type: Sequelize.STRING(50)
        },
        link:{
            type: Sequelize.STRING(50)
        },
        isTitle:{
            type: Sequelize.BOOLEAN
        },
        badge:{
            type: Sequelize.STRING(50)
        },
        isLayout:{
            type: Sequelize.BOOLEAN
        },
        urlBadge: {
            type: Sequelize.STRING(255)
        },
        ordre: {
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false
    });

    return Activite;
};
