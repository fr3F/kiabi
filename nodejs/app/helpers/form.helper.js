

// is integer
function isInteger(i){
    let rep = Number.parseInt(i);
     if(isNaN(rep))
        return false;
    return true;
}


// Tester si une chaine est une date
var isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

// Valider requete(type: nb, str, date)
function validerRequete(req, att = [], nomAtt=[], type = []){
    if(nomAtt.length == 0) nomAtt = att;
    for(let i = 0; i < att.length; i++){
        if(type.length!=0){
            if(type[i] == "nb" && !isInteger(req[att[i]]))
                throw new Error("Veuillez renseigner un nombre pour l'attribut \"" + nomAtt[i] + "\"")
            else if(req[att[i]] && type[i] == "date" && !isDate(req[att[i]]))
                throw new Error("Veuillez renseigner une date pour l'attribut \"" + nomAtt[i] + "\"")
            else if(!req[att[i]] && type[i]!="nb" &&  type[i]!="date"){
                throw new Error("Veuillez renseigner l'attribut \"" + nomAtt[i] + "\"")
            }
        }
        else if(!req[att[i]])
            throw new Error("Veuillez renseigner l'attribut \"" + nomAtt[i] + "\"")
    }
}

module.exports = {
    isDate,
    isInteger,
    validerRequete
}