const { sendError } = require("../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const { sendSalesMagasinToFtp } = require("./services/file.service");
const { getTicketsByMagasin, findTicketById } = require("./services/sales.service");

const AccesSales = {
    view: 14,
    send: 15,
}

exports.getTicketsByMagasin = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesSales.view, req, res))
            return;  
        const { date } = req.query;
        const resp = await getTicketsByMagasin(req.params.idMagasin, date);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.findTicketById = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesSales.view, req, res))
            return;  
        const resp = await findTicketById(req.params.idTicket);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};


exports.sendTicketsMagasin = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesSales.send, req, res))
            return;  
        const { date } = req.body;
        await sendSalesMagasinToFtp(req.params.idMagasin, date);
        res.send({message: "Sent"});
    }
    catch(err){
        sendError(res, err);
    }
};

