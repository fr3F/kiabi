const { getAllMagasins } = require("../../../magasin/services/magasin.service");
const { Loyact, sequelize } = require("../../../../../models");
const { Op } = require("sequelize");
const { sendFileToFtp } = require("../../../../data-transfert/services/upload.service");
const { FILE_LOYACT_PREFIX, FILE_LOYACT_EXT, LOAYCT_HEADER, FILE_LOYACT_SEPARATOR } = require("./constant");
const { loggerGlobal, loggerError } = require("../../../../../helpers/logger");
const { formatDate } = require("../../../../../helpers/helpers.helper");

function sendLoyactFileSync(){
    sendLoyactFile().then(()=>{
        loggerGlobal.info("Loyact KIABI sent")
    }).catch(
        (err)=>{
            loggerError.error("Loyact KIABI");
            loggerError.error(err.message);
            loggerError.error(err.stack);
        }
    )
}
async function sendLoyactFile(){
    await sendLoyactFileByDate(new Date());
}

async function sendLoyactFileByDate(date){
    const magasins = await getAllMagasins();
    const loyacts = await getLoyactsToExport(date);
    for(const magasin of magasins){
        await sendLoyactFileByMagasin(loyacts, magasin, date);
    }
}

async function getLoyactsToExport(date){
    date = formatDate(date, "YYYY-MM-DD");
    return await Loyact.findAll({
        where: {[Op.and]: [
            sequelize.where(sequelize.fn('DATE', sequelize.col('date')), date)
        ]},
    });
}

async function sendLoyactFileByMagasin(loyacts, magasin, date){
    loyacts = getLoyactsByMagasin(loyacts, magasin);
    const filename = generateFilename(magasin, date);
    const fileContent = exportLoyactFileByList(loyacts);
    await sendFileToFtp(fileContent, filename);
}

function getLoyactsByMagasin(loyacts, magasin){
    return loyacts.filter((r)=> r.magasin == magasin.storeCode);
}

function generateFilename(magasin, date){
    const storeCode = magasin.storeCode;
    date = formatDate(date, "YYMMDD");
    return `${FILE_LOYACT_PREFIX}_${storeCode}_${date}_01${FILE_LOYACT_EXT}`;
}

function exportLoyactFileByList(loyacts){
    let lines = [LOAYCT_HEADER];
    lines = lines.concat(generateLinesLoyact(loyacts));
    return lines.join(FILE_LOYACT_SEPARATOR.line);
}

function generateLinesLoyact(loyacts) {
    const lines = [];
    for(const loyact of loyacts){
        lines.push(generateLineLoyact(loyact));
    }
    return lines;
}

function generateLineLoyact(loyact){
    const fields = [
        loyact.noCarte,
        formatDatetLoyact(loyact),
        loyact.action,
        getBooleanValue(loyact.optinFid),
        loyact.newNoCarte?? "",
        loyact.origine,
        loyact.magasin,
        loyact.codeEtab,
        getPoints(loyact),
        loyact.cause
    ];
    return fields.join(FILE_LOYACT_SEPARATOR.column);
}

function formatDatetLoyact(loyact){
    return formatDate(loyact.date, "YYYY/MM/DD HH:mm:ss");
}

function getBooleanValue(value){
    if(value)
        return 1;
    return value == null? "": 0;
}

function getPoints(loyact){
    if(loyact.nbPoints == null)
        return "";
    return loyact.nbPoints;
}

module.exports = {
    sendLoyactFileSync,
    sendLoyactFile
}