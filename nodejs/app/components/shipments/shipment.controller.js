const { sendError } = require("../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const shipmentService = require("./services/shipment.service");
const receptionService = require("./services/reception.service");

const AccesShipment = {
    view: 12,
    reception: 13
}

exports.getListShipments = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesShipment.view, req, res))
            return;  
        const resp = await shipmentService.getListShipments(req);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.findShipmentById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesShipment.view, req, res))
            return;  
        const resp = await shipmentService.findShipmentById(req.params.id);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.receiveItems = async (req, res) => {
    try{
        const resp = await receptionService.receiveItems(req.body);
        res.send({message: "Received"});
    }
    catch(err){
        sendError(res, err);
    }
};

exports.receiveShipment = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesShipment.reception, req, res))
            return;  
        const resp = await receptionService.receiveShipment(req.params.id);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};
