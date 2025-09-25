const { verifierFichierBool } = require("../../helpers/file.helper");
const { isDate } = require("../../helpers/form.helper");
const helper = require("../../helpers/helpers.helper");
const db = require("../../models");
const sequelize = db.sequelize;
const { selectSql } = require("../../helpers/db.helper");
const { QueryTypes } = require("sequelize");

const fs = require("fs");
const TABLE_DATAREGLEMENT = "datareglement";
const NOT_NULLABLE = [4, 13, 14, 15, 17, 20, 21, 22, 23];
const ACOMPTE = "ACOMPTE";
const CASH = "cash";

async function getConditionParametrage(idParametrage){
    const parametrage = await helper.verifierExistence(db.parametrageCloture, idParametrage, "Paramétrage", 
        [{model: db.itemParametrageCloture, as: "items", include: ["magasin"]}]
    );
    const nommagasins = parametrage.items.map((r)=> `'${r.magasin.nommagasin}'`);
    return ` magasin IN(${nommagasins.join(', ')})`;
}

async function getReglementsExport(date, idParametrage){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const parametrage = await getConditionParametrage(idParametrage);
    const sql = `SELECT * 
                    FROM v_reglements_ticket_magasin
                    WHERE date(dateEncaissement) = date('${helper.formatDate(date, 'YYYY-MM-DD')}')
                        AND ${parametrage}
                    `;
    const rep = await selectSql(sql);
    if(!rep.length)
        throw new Error("Aucun règlement trouvé");
    return rep;
}

async function exporterReglement(date, idParametrage, res){
    const reglements = await getReglementsExport(date, idParametrage);
    let path, filename;
    await sequelize.transaction(async (transaction)=>{
        await insertDataReglements(reglements, transaction);
        let dataReglements = await getDataReglements(transaction);
        const data = createFile(date, dataReglements);
        path = data.path;
        filename = data.filename;
        await deleteDataReglements(transaction);
    })
    if(!res)
        return {path, filename};
    sendFileToResponse(path, filename, res);
    // return generateDataReglements(reglements);
}

function generateDataReglements(reglements){
    const rep = [];
    for(const reglement of reglements)
        rep.push(generateDataReglement(reglement));
    return rep;
}

// Recuperer libelle data reglement(n5), a partir de modepaiement 
function getLibelleData(reglement){
    if(!isAcompteNotCash(reglement))
        return `RGTT ${reglement.codemagasin}${reglement.nocaisse}${reglement.numticket} du ${helper.formatDate(reglement.dateticket, 'DD/MM/YY')}`;
    const infoMagasin = ` ${reglement.codemagasin}${reglement.nocaisse}`;
    reglement.modepaiement = reglement.modepaiement?? "";
    return reglement.modepaiement.substring(0, 35-infoMagasin.length) + infoMagasin;
}


function isAcompteNotCash(reglement){
    return reglement.modepaiement && reglement.modepaiement.toUpperCase().startsWith(ACOMPTE) 
    && reglement.typepaiement != CASH
}

function isAcompteCash(reglement){
    return reglement.modepaiement && reglement.modepaiement.toUpperCase().startsWith(ACOMPTE) 
    && reglement.typepaiement == CASH
}

function generateDataReglement(reglement){
    const dateSage = helper.formatDate(reglement.dateticket, "DDMMYY");
    const heure = helper.formatDate(reglement.dateticket, "HH:mm:ss");
    const libelle = getLibelleData(reglement);
    if(isAcompteCash(reglement))
        reglement.montantreglement *= -1;
    return {
        n2: reglement.codeclient,
        n3: dateSage,
        n4: "",
        n5: libelle,
        n6: helper.formaterNb(reglement.montantreglement, 2,  ','),
        n10: reglement.nomodereglement,
        n12: reglement.codejournal,
        n19: reglement.numreglement,
        n20: heure,
        // n21: "Caisse",
        // n22: reglement.namecaissier,
        n26: reglement.souche,
        n27: reglement.codeclient,
        n28: dateSage,
        idcloture: 0,
        numfacture: reglement.numeroFacture
    }
}

async function insertDataReglements(reglements, transaction){
    const dataReglements = generateDataReglements(reglements);
    await sequelize.getQueryInterface().bulkInsert(TABLE_DATAREGLEMENT, dataReglements, { transaction });
}


async function deleteDataReglements(transaction){
    const sql = `DELETE FROM ${TABLE_DATAREGLEMENT}`;
    await sequelize.query(sql, {type: QueryTypes.DELETE, transaction});
}

async function getDataReglements(transaction){
    const sql = `SELECT * FROM ${TABLE_DATAREGLEMENT}`;
    return await selectSql(sql, transaction);
}

function getContentFileDataReglement(dataReglement){
    const rep = ['#CRGT'];
    for(let i = 1; i <= 28; i++){
        const value = dataReglement["n"+i];
        if(value != "null" && value != null)
            rep.push(value);
        else{
            if(NOT_NULLABLE.indexOf(i) != -1)
                rep.push("");
            else
                rep.push(value);
        }

    }
    // rep.push('#CREC')
    // rep.push(dataReglement.numfacture)
    // rep.push(dataReglement.n28)
    // rep.push(dataReglement.n6)
    return rep.join("\r\n")
}

function getContentFileDataReglements(dataReglements){
    const rep = ['#FLG 000', '#VER 14'];
    for(const dataReglement of dataReglements){
        rep.push(getContentFileDataReglement(dataReglement));
    }
    rep.push('#FIN');
    return rep.join("\r\n")
}

function createFile(date, dataReglements){
    const filename = `reglement-${helper.formatDate(new Date(date), "YYYYMMDD")}.txt`;
    let path = `${global.__basedir}/public/reglements/${filename}`; 
    const contenu = getContentFileDataReglements(dataReglements); 
    helper.ecrireFichier(path, contenu, "latin1");
    return {path, filename};
}

function sendFileToResponse(path, filename, res){
    while(!verifierFichierBool(path)){
    }
    let stream = fs.createReadStream(path);               
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + filename + ";"
    );
    stream.on('open', function () {
        stream.pipe(res);
    })
}

module.exports = {
    exporterReglement
}