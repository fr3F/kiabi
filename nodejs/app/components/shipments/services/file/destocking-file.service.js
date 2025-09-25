const { Op } = require("sequelize");
const { formatDate } = require("../../../../helpers/helpers.helper");
const { CatCatalog } = require("../../../../models");
const { KIABI_SEPARATOR, KIABI_EXTENSION, KIABI_TAG } = require("../../../data-transfert/utils/constant");
const { LINE_LEVEL } = require("../../utils/constant");
const { sendFileToFtp } = require("../../../data-transfert/services/upload.service");

const FILE_PREFIX = "DSK";
const FILE_SUFFIX = "_0001";
const DESTOCKING_CAUSE = "DSK";
const EAN_LENGTH = 12;


async function sendDestockingToFtp(shipment){
    if(!shipment.destockingNumber)
        return;
    const fileContent = await getDestockingFileContent(shipment);
    const filename = generateFilename(shipment);
    await sendFileToFtp(fileContent, filename);
} 

async function getDestockingFileContent(shipment){
    const header = getHeaderContent(shipment);
    const lines = await getLinesContent(shipment);
    return [
        KIABI_TAG.open,
        header, 
        ...lines,
        KIABI_TAG.close
    ].join(KIABI_SEPARATOR.line);
}

function getHeaderContent(shipment){
    const receiptDate = formatDate(shipment.receiptDate, "YYYY/MM/DD HH:mm:ss");
    const resp = [
        LINE_LEVEL.header,
        shipment.storeCode,
        shipment.destockingNumber,
        receiptDate,
        DESTOCKING_CAUSE
    ];
    return resp.join(KIABI_SEPARATOR.column);
}

async function getLinesContent(shipment){
    const lines = [];
    const items = getItemsDestocking(shipment);
    const catalogs = await getCatalogsFromItems(items);
    for(const item of items){
        setItemSellingPrice(item, catalogs);
        lines.push(generateLine(item));
    }
    return lines;
}

function getItemsDestocking(shipment){
    return shipment.items.filter((r)=> r.expectedQty > r.receivedQty);
}

function generateLine(item){
    const resp = [
        LINE_LEVEL.data,
        item.eanCode.substr(0, EAN_LENGTH),
        Math.abs(item.ecart),
        item.sellingPrice.toFixed(2)
    ]
    return resp.join(KIABI_SEPARATOR.column);
}

function generateFilename(shipment){
    const creation = formatDate(shipment.receiptDate, "YYMMDD");
    let filename = `${FILE_PREFIX}_${shipment.storeCode}_${creation}${FILE_SUFFIX}`;
    return filename + KIABI_EXTENSION;
}

async function getCatalogsFromItems(items){
    const eanCodes = items.map((item)=> item.eanCode);
    return await CatCatalog.findAll({
        where: { eanCode: {[Op.in]: eanCodes}},
        raw: true
    })
}

function setItemSellingPrice(item, catalogs){
    item.sellingPrice = 0;
    const catalog = catalogs.find((r)=> r.eanCode == item.eanCode );
    if(catalog)
        item.sellingPrice = catalog.initSellingPrice;
}

module.exports = {
    sendDestockingToFtp
}