const dayjs = require('dayjs');
const { NumberToLetter } = require("convertir-nombre-lettre");
const { DEVISE, DEVISE_LONG } = require('../config/environments/mysql/environment');

function prixEnLettre(prix){
    let rep = ""
    if(prix < 0){
        rep = "moins ";
        prix = prix*-1;
    }
    prix = parseFloat(prix).toFixed(2);
    let split = ("" + prix).split(".");
     rep += NumberToLetter(split[0]) + " " + DEVISE_LONG;
    if(parseFloat(split[1]))
        rep += " virgule " + prixApresVirgule(split[1] + "");
    return rep[0].toUpperCase() + rep.substring(1);
}

function prixApresVirgule(prix){
    let rep = "";
    let i = 0;
    while(i < prix.length && prix.charAt(i) == '0'){
        rep += "zéro ";
        i++;
    };
    return rep + NumberToLetter(prix);
}


// Formatter nombre
// Si sans zero et nombre = 0 retourner ""
function formatNombre(nombre, sansZero = false){
    if(sansZero && (!nombre || !parseFloat(nombre)))
        return ""
    nombre = parseFloat(nombre).toFixed(2);
    let rep = new Intl.NumberFormat().format(nombre)
    let s = rep.split(",")
    if(s.length == 2)
        rep = s[0] + "," + (s[1].slice(0,2)).padEnd(2, "0");
    else
        rep = s[0] + ",00"
    return rep; 
}

// Formater date
function formatDate(date, format = "DD/MM/YYYY"){
    return dayjs(date).format(format);
}

function strToTel(str){
    let rep = "+261 " + str.substring(0, 2) + " " + str.substring(2, 4);
    rep += " " + str.substring(4, 7) + " " + str.substring(7);
    return rep;
}

function isNumber(i){
    let rep = Number.parseFloat(i);
     if(isNaN(rep))
        return false;
    return true;
}
module.exports = {
    formatDate,
    formatNombre,
    strToTel,
    prixEnLettre,
    isNumber
}