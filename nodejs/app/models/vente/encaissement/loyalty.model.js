module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("loyalty", {
        loyaltyCardNumber: {
            type: Sequelize.STRING(13),
        },   
        scoredPoints: {
            type: Sequelize.INTEGER
        },
        fidelityDiscount: {
            type: Sequelize.STRING(1)
        }
    }, {
        timestamps: false,
        tableName: "loyalty"
    });

    return Resp;
};
