const userServ = require("../../services/user/user.service")
const helper = require('../../helpers/helpers.helper');

// Authentification (Se connecter)
exports.login = async (req, res) => {
    try{
        userServ.login(req, res);
    }
    catch(err){
        helper.sendError(res, err)
    }
};

