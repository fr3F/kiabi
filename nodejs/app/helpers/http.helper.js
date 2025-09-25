const { verifierFichierBool } = require("./file.helper");
const fs = require("fs")
// Envoyer message d'erreur
function sendErrorMessage(res, message, status = 500){
    console.log(message)
    res.status(status).send({message: message});
}

// Envoyer erreur
function sendError(res, err, status = 500){
    console.log(err)
    res.status(status).send({message: err.message});
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
    sendError,
    sendErrorMessage,
    sendFileToResponse
}