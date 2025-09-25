const { validerRequete } = require("../../../helpers/form.helper");
const { dataToJson } = require("../../../helpers/helpers.helper");
const { isNumber } = require("../../../helpers/util.helper");
const { ShpShipment, ItemShipment, sequelize } = require("../../../models");
const { SHIPMENT_STATUS } = require("../utils/constant");
const { setDestockingNumber } = require("./destocking.service");
const { sendDestockingToFtp } = require("./file/destocking-file.service");
const { sendReceptionToFtp } = require("./file/reception-file.service");
const { findShipmentById } = require("./shipment.service");

async function receiveItems(data) {
    validateData(data);
    const shipment = await findShipment(data);
    const incrementedItems = getItemsIncremented(data, shipment);
    await updateItems(incrementedItems);
}

async function receiveShipment(id){
    const shipment = await findShipmentById(id);
    verifyStatusReception(shipment);    
    calculEcartItems(shipment);
    setInfoReception(shipment);
    await updateShipmentReception(shipment);
    return shipment;
} 

function validateData(data) {
    const attributes = ["storeCode", "invoiceNumber", "packingListNumber", "boxNumber", "cartonNumber", "items"];
    validerRequete(data, attributes);
    if(!Array.isArray(data.items) || !data.items.length)
        throw new Error("Veuillez renseigner les items");
}

async function findShipment(data) {
    const { storeCode, invoiceNumber, packingListNumber } = data;
    const shipment = await ShpShipment.findOne({
        where: { storeCode, packingListNumber, invoiceNumber },
        include: ["items"]
    });
    if(!shipment)
        throw new Error("Shipment introuvable");
    verifyStatusReception(shipment);
    return dataToJson(shipment);
}

function getItemsIncremented(data, shipment){
    const items = getRelatedItems(data, shipment);
    const itemsToIncrement = [];
    for(const item of data.items){
        incrementItem(item, items, itemsToIncrement)
    }
    return itemsToIncrement;
}   

function getRelatedItems(data, shipment){
    return shipment.items.filter(
        (r)=> r.boxNumber == data.boxNumber && r.cartonNumber == data.cartonNumber
    );
}


function incrementItem(item, items, itemsToIncrement){
    const itemToIncrement = findItemToIncrement(item, items, itemsToIncrement);
    if(itemToIncrement){
        if(isNumber(item.quantite) || item.qty <= 0)
            throw new Error("Veuillez renseigner des quantités positives")
        itemToIncrement.receivedQty += parseFloat(item.qty);
    }
}

function findItemToIncrement(item, items, itemsToIncrement){
    let tmp = itemsToIncrement.find(r => r.eanCode == item.eanCode);
    if(tmp)
        return tmp;
    tmp = items.find(r => r.eanCode == item.eanCode);
    if(tmp)
        itemsToIncrement.push(tmp);
    return tmp;
}

async function updateItems(items) {
    if(!items.length)
        return;
    await ItemShipment.bulkCreate(items, { updateOnDuplicate: ["receivedQty"]});
}

function verifyStatusReception(shipment){
    if(shipment.status != SHIPMENT_STATUS.new.value)
        throw new Error("Réception impossible (statut invalide)");
}

function calculEcartItems(shipment){
    for(const item of shipment.items){
        item.ecart = item.receivedQty - item.expectedQty;
    }
}

function setInfoReception(shipment){
    shipment.receiptDate = new Date();
    shipment.status = SHIPMENT_STATUS.received.value;
    shipment.statusLabel = SHIPMENT_STATUS.received.label;
}

async function updateShipmentReception(shipment) {
    const { receiptDate, status } = shipment;
    await sequelize.transaction(async (transaction)=>{
        await ShpShipment.update({receiptDate, status}, { 
            transaction, where: {id: shipment.id}
        });
        await updateItemsEcart(shipment.items, transaction);
        await setDestockingNumber(shipment, transaction);
        await sendFileToFtp(shipment);
    });
}

async function updateItemsEcart(items, transaction) {
    if(!items.length)
        return;
    await ItemShipment.bulkCreate(items, { updateOnDuplicate: ["ecart"], transaction});    
}

async function sendFileToFtp(shipment) {
    await sendReceptionToFtp(shipment);
    await sendDestockingToFtp(shipment);
}

module.exports = {
    receiveItems,
    receiveShipment
}