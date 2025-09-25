module.exports = (sequelize, Sequelize) => {
    const ShpShipment = sequelize.define("shp_shipments", {
        lineLevel: {
            type: Sequelize.STRING(1),
            allowNull: false
        },
        storeCode: {
            type: Sequelize.STRING(3),
            allowNull: false
        },
        invoiceNumber: {
            type: Sequelize.STRING(15),
            allowNull: false
        },
        packingListNumber: {
            type: Sequelize.STRING(18),
            allowNull: false
        },
        deliveryFormNumber: {
            type: Sequelize.STRING(12),
            allowNull: false
        },
        shipmentDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        receiptDate: {
            type: Sequelize.DATE,
        },
        destockingNumber: {
            type: Sequelize.STRING(15),
            unique: true
        },
        filename: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        receptionFilename: {
            type: Sequelize.STRING(50)
        }

    });

    return ShpShipment;
};
