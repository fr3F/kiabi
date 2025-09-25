const { selectSql } = require("../../helpers/db.helper");
const { formatDate } = require("../../helpers/helpers.helper");

// recuperer tous les jours du mois
function getDayMonths(month, year){
    let date = new Date();
    date.setDate(1);
    if(month)
        date.setMonth(month - 1);
    if(year)
        date.setFullYear(year);
    let mois = date.getMonth();
    let rep = [];
    while(mois == date.getMonth()){
        rep.push(formatDate(new Date(date), 'YYYY-MM-DD'));
        date.setDate(date.getDate() + 1);
    }
    return rep;
}

const mois = ["Janv.", "Fév.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];

// Recuperer année min et max dans une table
async function getMaxMinAnnee(table, attr){
    let sql = "select year(min(" + attr + ")) minAnnee, year(max(" + attr + ")) maxAnnee from " + table;
    let rep = await selectSql(sql);
    if(rep.length)
        return rep[0];
    let annee = new Date().getFullYear();
    return {maxAnnee: annee, minAnnee: annee}
}

// Recuperer annee existante table
async function getAnneeExistante(table, attr){
    let {minAnnee, maxAnnee} = await getMaxMinAnnee(table, attr);
    let rep = [];
    for(let i = minAnnee; i <= maxAnnee; i++)
        rep.push(i);
    return rep;
}



module.exports = {
    getDayMonths,
    mois,
    getMaxMinAnnee,
    getAnneeExistante,
}