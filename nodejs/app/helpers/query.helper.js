const { Op } = require("sequelize");
const { isDate } = require("./helpers.helper");
const db = require("../models");

function getConditionDate(column, req){

    let debut = req.query[column + "Debut"];
    let fin = req.query[column + "Fin"];
    let rep = {}; 
    let isDateDebut = isDate(debut);
    let isDateFin = isDate(fin);
    if(!isDateFin && !isDateDebut)
        return rep;
    else if(isDateDebut && !isDateFin){
        debut = getDateDebut(debut);
        rep[column] = {[Op.gte]: debut}
    }
    else if(!isDateDebut && isDateFin){
        fin = getDateFin(fin);
        rep[column] = {[Op.lte]: fin}
    }
    else{
        fin = getDateFin(fin);
        debut = getDateDebut(debut);
        rep[column] = {
            [Op.and]: [
                {[Op.gte]: debut},
                {[Op.lte]: fin},
            ]
        }    
    }
    return rep;
}   

function getDateDebut(debut){
    debut = new Date(debut);
    debut.setHours(0)
    debut.setMinutes(0)
    debut.setSeconds(0)
    return debut;
}

function getDateFin(fin){
    fin = new Date(fin);
    fin.setHours(23)
    fin.setMinutes(59)
    fin.setSeconds(59)
    return fin;
}

function addConditionClient(idClient, filters, nomAsset = "asset"){
    if(!idClient)
        return;
    let clientAsset = "$" + nomAsset + ".idClient$";
    if(!nomAsset)
        clientAsset = "idClient";
    let cond = [
        {"$itemContrat.contrat.idClient$": idClient},
    ]
    let condClientAsset = {}
    condClientAsset[clientAsset] = idClient;
    cond.push(condClientAsset);
    if(filters[Op.or]){
        filters[Op.and] = [
            filters[Op.or],
            {[Op.or]: cond}
        ]
    }
    else
        filters[Op.or] = cond;
}

// Intervention, demande, diag, reparation
function getOrder(req, nomAsset = "asset"){
    let col = "createdAt";
    let typeTri = "ASC";
    if(req.query.tri)
        col = req.query.tri;
    if(req.query.typeTri == "ASC" || req.query.typeTri == "DESC")
        typeTri = req.query.typeTri;
    else if(col == "createdAt")
        typeTri = "DESC";
    if(col == "numeroDeSerie"){
        // return [[{model: db.element, as: nomAsset}, "numeroDeSerie", typeTri]];
        return [[db.sequelize.literal("`" + nomAsset + "`.`numeroDeSerie`"), typeTri]];

    }
    if(col == "modele")
        return [[db.sequelize.literal("concat(`" + nomAsset + "->modele`.`marque`, ' ', `" + nomAsset + "->modele`.`designation`)"), typeTri]];
    return [[col, typeTri]];
}


module.exports = {
    getConditionDate,
    addConditionClient,
    getOrder
}