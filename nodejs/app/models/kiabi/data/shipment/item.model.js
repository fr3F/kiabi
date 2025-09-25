module.exports = (sequelize, Sequelize) => {
    const ItemShipment = sequelize.define("item_shp_shipments", {
        lineLevel: {
            type: Sequelize.STRING(1),
            allowNull: false
        },
        boxNumber: {
            type: Sequelize.STRING(13),
            allowNull: false
        },
        cartonNumber: {
            type: Sequelize.STRING(13),
            allowNull: false
        },
        itemCode: {
            type: Sequelize.STRING(13),
            allowNull: false
        },
        eanCode: {
            type: Sequelize.STRING(13),
            allowNull: false
        },
        expectedQty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        purchasePrice: {
            type: Sequelize.DOUBLE(9, 2),
            allowNull: false
        },
        purchasePriceCurrencyCode: {
            type: Sequelize.STRING(3),
            allowNull: false
        },
        tarifCode1: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        tarifCode2: {
            type: Sequelize.INTEGER
        },
        tarifCode3: {
            type: Sequelize.INTEGER
        },
        tarifCode4: {
            type: Sequelize.INTEGER
        },
        tarifCode5: {
            type: Sequelize.INTEGER
        },
        tarifCode6: {
            type: Sequelize.INTEGER
        },
        tarifCode7: {
            type: Sequelize.INTEGER
        },
        tarifCode8: {
            type: Sequelize.INTEGER
        },
        tarifCode9: {
            type: Sequelize.INTEGER
        },
        countryOriginCode: {
            type: Sequelize.STRING(3),
            allowNull: false
        },
        receivedQty: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        ecart: {
            type: Sequelize.INTEGER
        }
    });

    return ItemShipment;
};
