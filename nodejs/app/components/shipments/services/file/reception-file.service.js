const { formatDate } = require("../../../../helpers/helpers.helper");
const { sendFileToFtp } = require("../../../data-transfert/services/upload.service");
const { KIABI_SEPARATOR, KIABI_EXTENSION, KIABI_TAG } = require("../../../data-transfert/utils/constant");
const { ShpShipmentFile } = require("../../../data-transfert/utils/fileConstant");
const { LINE_LEVEL } = require("../../utils/constant");

const FILE_PREFIX = "RCP";
const FILE_SUFFIX = "_01";
const WITHOUT_CONTROL_LENGTH = 12;

async function sendReceptionToFtp(shipment){
    const fileContent = getReceptionFileContent(shipment);
    const filename = generateFilename(shipment);
    await sendFileToFtp(fileContent, filename);
} 

function getReceptionFileContent(shipment){
    const header = getHeaderContent(shipment);
    const lines = getLinesContent(shipment);
    return [
        KIABI_TAG.open,
        header, 
        ...lines,
        KIABI_TAG.close
    ].join(KIABI_SEPARATOR.line);
}

function getHeaderContent(shipment){
    const receiptDate = formatDate(shipment.receiptDate, "YYYY/MM/DD HH:mm:ss");
    setReceiptCompleted(shipment);
    const resp = [
        LINE_LEVEL.header,
        shipment.storeCode,
        shipment.invoiceNumber,
        shipment.packingListNumber,
        shipment.deliveryFormNumber,
        receiptDate,
        shipment.receiptCompleted
    ];
    return resp.join(KIABI_SEPARATOR.column);
}

function setReceiptCompleted(shipment){
    shipment.receiptCompleted = "1";
}

function getLinesContent(shipment){
    const lines = [];
    for(const item of shipment.items){
        lines.push(generateLine(item));
    }
    return lines;
}

function generateLine(item){
    const resp = [
        LINE_LEVEL.data,
        removeControlDigit(item.boxNumber),
        removeControlDigit(item.cartonNumber),
        removeControlDigit(item.eanCode),
        item.expectedQty,
        item.expectedQty
    ]
    return resp.join(KIABI_SEPARATOR.column);
}

function removeControlDigit(code){
    return code.substr(0, WITHOUT_CONTROL_LENGTH);
}

function generateFilename(shipment){
    let filename = shipment.filename.split(".")[0];
    filename = filename.replace(ShpShipmentFile.prefix, FILE_PREFIX);
    filename += FILE_SUFFIX;
    filename += KIABI_EXTENSION;
    return filename;
}

module.exports = {
    sendReceptionToFtp
}