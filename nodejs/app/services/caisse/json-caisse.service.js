const { URL_API } = require("../../config/environments/mysql/environment");
const { ErrorCode } = require("../../helpers/error");
const { copierValeurAttribut, verifierExistence, formaterNb, formatEntier } = require("../../helpers/helpers.helper");
const { caisse: Caisse } = require("../../models");
const magasinService = require("./../magasin/magasin.service");

async function getJsonCaisse(id){
    const caisse = await verifierExistence(Caisse, id, "Caisse");
    verifyCaisseConfigured(caisse)
    const magasin = await magasinService.findById(caisse.idMagasin);
    return generateJsonCaisse(caisse, magasin);   
}

function verifyCaisseConfigured(caisse){
    const requiredAttributes = ["apiUrl", "printerVendorID", "printerProductID", "portafficheur"];
    for(const attribute of requiredAttributes){
        if(!caisse[attribute])
            throw new ErrorCode("Cette caisse n'est pas configuré");
    }
}

function generateJsonCaisse(caisse, magasin){
    const resp = {};
    addEnvToJson(resp);
    addCaisseToJson(resp, caisse);
    addMagasinToJson(resp, magasin);
    return resp;
}

function addEnvToJson(resp){
    resp.remoteapi = URL_API.substring(0, URL_API.length - 1);
}

function addCaisseToJson(resp, caisse){
    const attributes = ["apiUrl", "nocaisse", "printerVendorID", "printerProductID", "portafficheur"];
    copierValeurAttribut(caisse, resp, attributes);
}

function addMagasinToJson(resp, magasin){    
    addMagasinToJsonManually(resp, magasin);
    const attributes = ["count", "defaultcompte", "identifiant", "facebook", "siteweb", "interim", "gifi", "telephone", "horaireweek",
        "local", "showcodeean", "showmsgretour", "acompte", "cloturesodim", "brn", "vat", "instagram", "decimalauto",
        "rounded", "modepaiement", "clients", "defaultTauxDiscount", "motifremise", "motifannulation", "motifouverturetiroir", "motifretour", 
        "footermsg", "clotureneedresp", "useAllPoint"
    ];
    copierValeurAttribut(magasin, resp, attributes);
}

function addMagasinToJsonManually(resp, magasin){
    resp.magasin = magasin.nommagasin;
    resp.codemagasin = magasin.code;
    resp.defaultdepot = { name: magasin.depotstockage };
    resp.monnaie = magasin.devise;
    resp.horaireouvrable = magasin.horaireouvrable.horaire;
    addMonnaiesToJson(resp, magasin.monnaies)
    addDepotsToJson(resp, magasin.depots)
}

function addDepotsToJson(resp, depots){
    resp.depots = depots.map((r)=> {
        return { name: r.nomdepot };
    })
}

function addMonnaiesToJson(resp, monnaies){
    resp.listemonnaie = monnaies.monnaie.map((r)=> {
        r.quantite = 0;
        r.lib = `${formatEntier(r.valeur)} ${r.lib}`.replaceAll(" ", " ");
        return r;
    });
}

module.exports = {
    getJsonCaisse
}