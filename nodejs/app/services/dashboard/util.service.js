const { sourceDBConfig } = require("../../config/environments/mysql/environment");
const mysql2 = require('mysql2');
const { getDayMonths, mois } = require("./util");
const { formatDate } = require("../../helpers/helpers.helper");


function getDbConfigMagasin(magasin){
    const dbConfig = {...sourceDBConfig};
    dbConfig.database = magasin.nomBase;
    return dbConfig;
}

// const mysql2 = require("mysql2");

async function getDataMagasinDb(magasin, sql) {
    const dbConfig = getDbConfigMagasin(magasin);
    const connection = mysql2.createConnection(dbConfig).promise();
    console.log('dbConfig utilisé :', dbConfig);

    try {
        const [rows] = await connection.query(sql);
        return rows;
    } catch (err) {
        console.error("Erreur lors de la requête :", err.message);
        throw new Error("Impossible de se connecter à la base de données ou d'exécuter la requête.");
    } finally {
        await connection.end();
    }
}


async function updateDataMagasinDb(magasin, sql){
    const dbConfig = getDbConfigMagasin(magasin);
    let connection = null;
    try{
        connection = mysql2.createConnection(dbConfig);
        await connection.promise().query(sql);
    }
    catch(err){
        console.log(err)
        throw new Error("Impossible de se connecter à la base de données");
    }
    finally{
        closeConnection(connection);
    }
}

function closeConnection(connection){
    try{
        if(connection)
          connection.end(); 
      }
      catch(err){
        console.log(err)
        throw new Error("Impossible de se connecter à la base de données");
    }

}

const dateSearchOptions = [
    { type: "date", func: "DATE", year: false, interval: "DAY" },
    { type: "week", func: "WEEK", year: true, interval: "WEEK" },
    { type: "month", func: "MONTH", year: true, interval: "MONTH" },
    { type: "quarter", func: "QUARTER", year: true, interval: "QUARTER" },
    { type: "hier", func: "DATE", year: false, interval: "DAY", to_substract: 1 },
    { type: "year", func: "YEAR", year: false, interval: "YEAR" },
];

// Utilisé pour tableau de bord famille(aujourd'hui, hier, ...)
const periode2 = [
    { type: "date", func: "DATE", year: false},
    { type: "hier", func: "DATE", interval: "DAY", year: false},
    { type: "week", func: "WEEK", year: true},
    { type: "month", func: "MONTH", year: true},
    { type: "quarter", func: "QUARTER", year: true},
    { type: "year", func: "YEAR", year: false},
]

function getDateSearchOption(type){
    const rep = dateSearchOptions.find((r)=> r.type == type);
    if(!rep)
        throw new Error("Type invalide");
    return rep;
}

function getPeriode2(type){
    const rep = periode2.find((r)=> r.type == type);
    if(!rep)
        throw new Error("Type invalide");
    return rep;
}

function getSqlStatDayTicket(attribute){
    const sql = `SELECT ${attribute} valeur, date(datecreation) label
                    FROM ticket 
                    WHERE month(datecreation) = month(now())
                        and year(datecreation) = year(now())
                    GROUP BY date(datecreation)    
                    `;
    return sql;
}


function getSqlStatMonthTicket(attribute){
    const sql = `SELECT ${attribute} valeur, month(datecreation) label
                    FROM ticket 
                    WHERE year(datecreation) = year(now())
                    GROUP BY month(datecreation)`;
    return sql;
}

function getSqlStatYearTicket(attribute){
    const sql = `SELECT ${attribute} valeur, year(datecreation) label
                    FROM ticket 
                    GROUP BY year(datecreation) ORDER BY year(datecreation) ASC`;
    return sql;
}

async function getStatDayTicket(magasin, attribute){
    const sql = getSqlStatDayTicket(attribute);
    const rep = await getDataMagasinDb(magasin, sql) ;
    const dates = getDayMonths();
    const labels = []
    const data = [];
    for(let date of dates){
        const label = formatDate(date, 'DD-MM-YYYY');
        let tmp = rep.find(r=> label == formatDate(new Date(r.label), 'DD-MM-YYYY'))
        addLabelValue(labels, data, tmp, label)
    } 
    return {labels, data};
}

function addLabelValue(labels, data, tmp, label){
    let value = 0;
    if(tmp)
        value = tmp.valeur;
    labels.push(label);
    data.push(value)
}

async function getStatMonthTicket(magasin, attribute){
    const sql = getSqlStatMonthTicket(attribute);
    const rep = await getDataMagasinDb(magasin, sql);
    const labels = []
    const data = [];
    const year = new Date().getFullYear()
    for(let i = 0; i<12; i++){
        const label = mois[i] + " " + year;
        const tmp = rep.find(r=> i+1 == r.label)
        addLabelValue(labels, data, tmp, label)
    } 
    return {labels, data};
}


async function getStatYearTicket(magasin, attribute){
    const sql = getSqlStatYearTicket(attribute);
    const rep = await getDataMagasinDb(magasin, sql);
    const labels = []
    const data = [];
    if(!rep.length)
        return {labels, data};
    for(let i = rep[0].label; i<=rep[rep.length -1].label; i++){
        const tmp = rep.find(r=> i == r.label);
        addLabelValue(labels, data, tmp, i)
    } 
    return {labels, data};
}


function verifyTypePeriodChart(type){
    const types = ["date", "month", "year"];
    if(types.indexOf(type) == -1)
        throw new Error("Type invalide");
}


function getSqlEcart(type, column, prev = false){
    const searchOption = getDateSearchOption(type);
    const dateValue = getValeurDatePeriode(searchOption, prev);
    const sql = `SELECT COALESCE(${column}, 0) valeur
                    FROM ticket 
                        WHERE (${searchOption.func}(datecreation) = ${searchOption.func}(${dateValue}) ${getConditionEcartLundi(searchOption, prev)})
                            ${searchOption.year? `AND YEAR(datecreation) = YEAR(${dateValue}) `: ''}`;
    return sql;
}



function getValeurDatePeriode(searchOption, prev){
    let nbPrev = prev? 1: 0;
    if(searchOption.to_substract)
        nbPrev += searchOption.to_substract;
    return `DATE_SUB(NOW(), INTERVAL ${nbPrev} ${searchOption.interval})`;
}

function getConditionEcartLundi(searchOption, prev){
    if(!prev || new Date().getDay() != 1 || searchOption.type != "date")
        return "";
    return ` OR DATE(datecreation) = DATE(DATE_SUB(NOW(), INTERVAL 2 DAY)) `;
}

module.exports = {
    getDbConfigMagasin,
    getDataMagasinDb,
    dateSearchOptions,
    getDateSearchOption,
    getStatDayTicket,
    getStatMonthTicket,
    getStatYearTicket,
    verifyTypePeriodChart,
    getSqlEcart,
    getValeurDatePeriode,
    getConditionEcartLundi,
    getPeriode2,
    updateDataMagasinDb
}