module.exports = (sequelize, Sequelize) => {
    const CatCatalog = sequelize.define("cat_catalogs", {
        statusFlag: {
            type: Sequelize.STRING(1),
            allowNull: false
        },
        styleCode: {
            type: Sequelize.STRING(5),
            allowNull: false
        },
        theme: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        collection: {
            type: Sequelize.STRING(8),
            allowNull: false
        },
        collectionDescription: {
            type: Sequelize.STRING(40),
            allowNull: false
        },
        countryOriginCode: {
            type: Sequelize.STRING(2),
            allowNull: false
        },
        itemCode: {
            type: Sequelize.STRING(13),
            allowNull: false
        },
        eanCode: {
            type: Sequelize.STRING(13),
            allowNull: false,
            unique: true
        },
        color: {
            type: Sequelize.STRING(8),
            allowNull: false
        },
        colorDescription: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        colorBasicDescription: {
            type: Sequelize.STRING(40),
            allowNull: false
        },
        size: {
            type: Sequelize.STRING(7),
            allowNull: false
        },
        sizeDescription: {
            type: Sequelize.STRING(7),
            allowNull: false
        },
        categoryCode: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        categoryDescription: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        storyCode: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        storyDescription: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        productTypeCode: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        productTypeDescription: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        initSellingPrice: {
            type: Sequelize.DOUBLE(9, 2),
            allowNull: false
        },
        currency: {
            type: Sequelize.STRING(3),
            allowNull: false
        },
        gammeTailleMin: {
            type: Sequelize.STRING(7)
        },
        gammeTailleMax: {
            type: Sequelize.STRING(7)
        },
        detailedProductDescription: {
            type: Sequelize.STRING(51)
        }
    });

    return CatCatalog;
};
