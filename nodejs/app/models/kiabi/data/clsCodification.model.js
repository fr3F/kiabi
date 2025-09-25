module.exports = (sequelize, Sequelize) => {
    const ClsCodification = sequelize.define("cls_codifications", {
        // statusFlag: {
        //     type: Sequelize.STRING(1),
        //     allowNull: false
        // },
        class: {
            type: Sequelize.STRING(10),
            unique: true
        },
        classDescription: {
            type: Sequelize.STRING(30),
        },
        classLongDescription: {
            type: Sequelize.STRING(60),
        },
        department: {
            type: Sequelize.STRING(3),
        },
        departmentDescription: {
            type: Sequelize.STRING(10),
        },
        departmentLongDescription: {
            type: Sequelize.STRING(60),
        },
        market: {
            type: Sequelize.STRING(3),
        },
        marketDescription: {
            type: Sequelize.STRING(10),
        },
        marketLongDescription: {
            type: Sequelize.STRING(60),
        },
        group: {
            type: Sequelize.STRING(3),
        },
        groupDescription: {
            type: Sequelize.STRING(10),
        },
        groupLongDescription: {
            type: Sequelize.STRING(60),
        }
    });

    return ClsCodification;
};
