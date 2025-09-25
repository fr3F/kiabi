const { ClsCodification, CatCatalog, ShpShipment, ItemShipment } = require("../../../models")
const { SHIPMENT_STATUS } = require("../../shipments/utils/constant")

const KIABI_DATATYPE = {
    number: "nb",
    string: "str",
    date: "date",
}

const ClsCodificationFile = {
    name: "CLS",
    prefix: "CLS",
    model: ClsCodification,
    columns: [
        // { name: "statusFlag", type: KIABI_DATATYPE.string },
        { name: "class", type: KIABI_DATATYPE.string },
        { name: "classDescription", type: KIABI_DATATYPE.string },
        { name: "classLongDescription", type: KIABI_DATATYPE.string },
        { name: "department", type: KIABI_DATATYPE.string },
        { name: "departmentDescription", type: KIABI_DATATYPE.string },
        { name: "departmentLongDescription", type: KIABI_DATATYPE.string },
        { name: "market", type: KIABI_DATATYPE.string },
        { name: "marketDescription", type: KIABI_DATATYPE.string },
        { name: "marketLongDescription", type: KIABI_DATATYPE.string },
        { name: "group", type: KIABI_DATATYPE.string },
        { name: "groupDescription", type: KIABI_DATATYPE.string },
        { name: "groupLongDescription", type: KIABI_DATATYPE.string }
    ]
}

const CatCatalogFile = {
    prefix: "CAT",
    name: "CAT",
    model: CatCatalog,
    columns: [
        { name: "statusFlag", type: KIABI_DATATYPE.string },
        { name: "styleCode", type: KIABI_DATATYPE.string },
        { name: "theme", type: KIABI_DATATYPE.string },
        { name: "collection", type: KIABI_DATATYPE.string },
        { name: "collectionDescription", type: KIABI_DATATYPE.string },
        { name: "countryOriginCode", type: KIABI_DATATYPE.string },
        { name: "itemCode", type: KIABI_DATATYPE.string },
        { name: "eanCode", type: KIABI_DATATYPE.string },
        { name: "color", type: KIABI_DATATYPE.string },
        { name: "colorDescription", type: KIABI_DATATYPE.string },
        { name: "colorBasicDescription", type: KIABI_DATATYPE.string },
        { name: "size", type: KIABI_DATATYPE.string },
        { name: "sizeDescription", type: KIABI_DATATYPE.string },
        { name: "categoryCode", type: KIABI_DATATYPE.string },
        { name: "categoryDescription", type: KIABI_DATATYPE.string },
        { name: "storyCode", type: KIABI_DATATYPE.string },
        { name: "storyDescription", type: KIABI_DATATYPE.string },
        { name: "productTypeCode", type: KIABI_DATATYPE.string },
        { name: "productTypeDescription", type: KIABI_DATATYPE.string },
        { name: "initSellingPrice", type: KIABI_DATATYPE.number },
        { name: "currency", type: KIABI_DATATYPE.string },
        { name: "gammeTailleMin", type: KIABI_DATATYPE.string },
        { name: "gammeTailleMax", type: KIABI_DATATYPE.string },
        { name: "detailedProductDescription", type: KIABI_DATATYPE.string },
    ]
}

const ShpShipmentFile = {
    prefix: "SHP",
    name: "SHP",
    model: ShpShipment,
    itemModel: ItemShipment,
    foreignKey: "idShipment",
    lineSeparator: "\n",
    defaultStatus: SHIPMENT_STATUS.new.value,
    columns: [
        { name: "lineLevel", type: KIABI_DATATYPE.string },
        { name: "storeCode", type: KIABI_DATATYPE.string },
        { name: "invoiceNumber", type: KIABI_DATATYPE.string },
        { name: "packingListNumber", type: KIABI_DATATYPE.number },
        { name: "deliveryFormNumber", type: KIABI_DATATYPE.number },
        { name: "shipmentDate", type: KIABI_DATATYPE.date },
    ],
    itemColumns: [
        { name: "lineLevel", type: KIABI_DATATYPE.string },
        { name: "boxNumber", type: KIABI_DATATYPE.string },
        { name: "cartonNumber", type: KIABI_DATATYPE.string },
        { name: "itemCode", type: KIABI_DATATYPE.string },
        { name: "eanCode", type: KIABI_DATATYPE.string },
        { name: "expectedQty", type: KIABI_DATATYPE.number },
        { name: "purchasePrice", type: KIABI_DATATYPE.number },
        { name: "purchasePriceCurrencyCode", type: KIABI_DATATYPE.string },
        { name: "tarifCode1", type: KIABI_DATATYPE.number },
        { name: "tarifCode2", type: KIABI_DATATYPE.number },
        { name: "tarifCode3", type: KIABI_DATATYPE.number },
        { name: "tarifCode4", type: KIABI_DATATYPE.number },
        { name: "tarifCode5", type: KIABI_DATATYPE.number },
        { name: "tarifCode6", type: KIABI_DATATYPE.number },
        { name: "tarifCode7", type: KIABI_DATATYPE.number },
        { name: "tarifCode8", type: KIABI_DATATYPE.number },
        { name: "tarifCode9", type: KIABI_DATATYPE.number },
        { name: "countryOriginCode", type: KIABI_DATATYPE.string },
    ]
}

module.exports = {
    CatCatalogFile,
    ClsCodificationFile,
    ShpShipmentFile,
    KIABI_DATATYPE
}