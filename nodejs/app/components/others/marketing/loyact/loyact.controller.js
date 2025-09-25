const { sendError } = require("../../../../helpers/helpers.helper");
const actionService = require("./services/action.service");
const utilService = require("./services/util.service");

async function addLoyactAction(req, res, fonction){
    try{
        const loyact = await fonction(req.body);
        res.send(loyact);
    }
    catch(err){
        sendError(res, err);
    }
}

async function getData(req, res, fonction){
    try{
        const data = await fonction();
        res.send(data);
    }
    catch(err){
        sendError(res, err);
    }
}
exports.addCardCreation = async (req, res) => {
    await addLoyactAction(req, res, actionService.addCardCreation);
};

exports.addTicketRecovery = async (req, res) => {
    await addLoyactAction(req, res, actionService.addTicketRecovery);
};

exports.addAnniversary = async (req, res) => {
    await addLoyactAction(req, res, actionService.addAnniversary);
};

exports.addBirthPoints = async (req, res) => {
    await addLoyactAction(req, res, actionService.addBirthPoints);
};

exports.addWelcomePack = async (req, res) => {
    await addLoyactAction(req, res, actionService.addWelcomePack);
};

exports.addMarketingOperation = async (req, res) => {
    await addLoyactAction(req, res, actionService.addMarketingOperation);
};

exports.addCardTransfert = async (req, res) => {
    await addLoyactAction(req, res, actionService.addCardTransfert);
};

exports.addCardBlocking = async (req, res) => {
    await addLoyactAction(req, res, actionService.addCardBlocking);
};

exports.getTransertCauses = async (req, res) => {
    await getData(req, res, utilService.getTransfertCauses);
};

exports.getBlockingCauses = async (req, res) => {
    await getData(req, res, utilService.getBlockingCauses);
};

