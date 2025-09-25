const XMLHttpRequest = require("xhr2");
const { urlApiUtil, mailSite } = require("../config/environments/mysql/environment");

function sendMail(destinataires, cc, contenu, objet, attachments = []){
    let data = {emails: destinataires, cc, contenu, objet, attachments, from: mailSite};
    // data = JSON.stringify(data)
    let url = urlApiUtil + "/api/send-mail";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = (e)=>{
        console.log("mail envoyé")
    };
    xhr.send(JSON.stringify(data));
}



module.exports = {
    sendMail,
}