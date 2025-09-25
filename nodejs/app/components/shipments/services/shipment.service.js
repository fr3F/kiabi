const { Op } = require("sequelize");
const { dataToJson, getPagingData, getVarNecessairePagination, getFiltreRecherche, verifierExistence } = require("../../../helpers/helpers.helper");
const { ShpShipment } = require("../../../models");
const { SHIPMENT_STATUS } = require("../utils/constant");

// List with pagination, and criteria
async function getListShipments(req){
    let { page, limit, offset } = getVarNecessairePagination(req);
    let option = await getOptionGetShipment(req, limit, offset);
    let rep = await ShpShipment.findAndCountAll(option);
    rep = dataToJson(rep);
    setListStatusLabel(rep.rows);
    return getPagingData(rep, page, limit)
};

async function getOptionGetShipment(req, limit, offset){
    let filters = await getFiltreRechercheShipment(req);
    let order = [['createdAt', 'DESC']];
    return {
        where: filters,
        limit, offset,
        order
    };
}

async function getFiltreRechercheShipment(req){
    let filters = getFiltreRecherche(req, ["invoiceNumber"]);
    if(!req.query.search)
        filters = {};
    return filters;
}

async function findShipmentById(id) {
    const shipment = await verifierExistence(ShpShipment, id, "Shipment", ["items"]);
    setShipmentStatusLabel(shipment);
    shipment.boxs = getBoxGrouped(shipment.items);
    return shipment;
}

function setListStatusLabel(list) {
    for (const item of list) {
        setShipmentStatusLabel(item);
    }
}

function setShipmentStatusLabel(shipment){
    const statusEntry = Object.values(SHIPMENT_STATUS).find(s => s.value === shipment.status);
    shipment.statusLabel = statusEntry ? statusEntry.label : "Inconnu"; // Ajout du label ou valeur par défaut
}

function getBoxGrouped(items){
    const boxNumbers = getUniqueValues("boxNumber", items);
    const resp = [];
    for(const boxNumber of boxNumbers){
        resp.push(getItemsBoxNumber(boxNumber, items));
    }
    return resp;
}

function getItemsBoxNumber(boxNumber, items){
    items = items.filter((item)=> item.boxNumber == boxNumber);
    const cartonNumbers = getUniqueValues("cartonNumber", items);
    const nbItems = cartonNumbers.length;
    let nbReceivedItems = 0;
    const cartons = [];
    for(const cartonNumber of cartonNumbers){
        const tmp = getItemsCartonNumber(cartonNumber, items);
        if(tmp.nbReceivedItems == tmp.nbItems)
            nbReceivedItems++;
        cartons.push(tmp);
    }
    return { boxNumber, cartons, nbItems, nbReceivedItems }
}

function getItemsCartonNumber(cartonNumber, items){
    items = items.filter((item)=> item.cartonNumber == cartonNumber);
    const nbItems = items.length;
    const nbReceivedItems = items.filter((item)=> item.receivedQty > 0).length;
    return { items, cartonNumber, nbItems, nbReceivedItems }
}

function getUniqueValues(attribute, items){
    const duplicated = items.map((item)=> item[attribute]);
    const set = new Set(duplicated);
    return Array.from(set);    
}

module.exports = {
    getListShipments,
    findShipmentById
}