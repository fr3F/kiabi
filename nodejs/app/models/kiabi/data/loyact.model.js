module.exports = (sequelize, Sequelize) => {
    const Loyact = sequelize.define("loyact", {
        noCarte: {
            type: Sequelize.STRING(12),
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        action: {
            type: Sequelize.INTEGER(1),
            allowNull: false
        },
        optinFid: {
            type: Sequelize.BOOLEAN        
        },
        newNoCarte: {
            type: Sequelize.STRING(12)
        },
        origine: {
            type: Sequelize.INTEGER(1),
            allowNull: false
        },
        magasin: {
            type: Sequelize.STRING(3),
            allowNull: false
        },
        codeEtab: {
            type: Sequelize.STRING(5),
            allowNull: false
        },
        nbPoints: {
            type: Sequelize.INTEGER(5)
        },
        cause: {
            type: Sequelize.INTEGER(2)
        },
    }, {
        freezeTableName: true
    });

    return Loyact;
};
