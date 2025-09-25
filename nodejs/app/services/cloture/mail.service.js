const { sendEmail } = require("../../config/environments/mysql/email.config");
const { isDate } = require("../../helpers/form.helper");
const { formatDate, getValeurAttribut } = require("../../helpers/helpers.helper");
const { exporterReglement } = require("./file-reglement.service");
const { exporterFichierSage, exporterFichierSql } = require("./file.service");
let Handlebars = require("handlebars");

const fs = require("fs");

const db = require("./../../models");
const { urlBackLocal } = require("../../config/environments/mysql/environment");
const { TYPE_DESTINATAIRE } = require("../util/util");

const Destinataire = db.destinataireMail;
let urlLogo = urlBackLocal + "../assets/images/logo-transparent.png";

async function envoyerMailSage(date, idParametrage){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const fileSage = await exporterFichierSage(date, idParametrage);
    // const fileSql = await exporterFichierSql(date);
    const fileReglement = await exporterReglement(date, idParametrage);
    date = formatDate(new Date(date), 'DD/MM/YYYY');
    const subject = "Fichier à transférer vers SAGE du " + date;
    const pathTemplate = __basedir + "/app/templates/mail/transfert-sage.html";
    const source =  fs.readFileSync(pathTemplate, "utf8");
    const template = Handlebars.compile(source);
    const  htmlContent = template({date, urlLogo});
    const destinataires = await getDestinataires();
    let attachments = getAttachements(fileSage, fileReglement)
    await sendEmail(destinataires, subject, htmlContent, attachments);

}

function getAttachements(fileSage, fileReglement){
    return [
        {
            filename: fileSage.filename,
            path: fileSage.path
        },
        {
            filename: fileReglement.filename,
            path: fileReglement.path
        },
      
    ]
}

async function getDestinataires(){
    let rep = await Destinataire.findAll(
        {where: {type: TYPE_DESTINATAIRE.normal}}
    );
    return getValeurAttribut("email", rep);
}

module.exports = {
    envoyerMailSage
}