const { sendError } = require("../../helpers/helpers.helper");
const { verifierAccesConnecte } = require("../../services/acces/fonctionnalite.service");
const dataService = require("./services/data.service");
const { getListHistories } = require("./services/history.service");

const AccesData = {
    view: 9,
    update: 10
};

// List with pagination
exports.getListHistories = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesData.view, req, res))
            return;   
        let resp = await getListHistories(req);
        res.send(resp);
    }
    catch(err){
        sendError(res, err);
    }
};

exports.updateAllDataFromFtp = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(AccesData.update, req, res))
            return;   
        await dataService.initDataFromFtp();
        res.send({ message: "OK"});
    }
    catch(err){
        sendError(res, err);
    }
};



