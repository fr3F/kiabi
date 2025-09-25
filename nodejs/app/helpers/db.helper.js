const { QueryTypes } = require("sequelize/dist");
const { sequelize } = require("../models");

async function selectSql(sql, transaction = null){
    let tabs = await sequelize.query(sql, {type: QueryTypes.SELECT, transaction});
    return tabs;
}


async function executeSql(sql, transaction = null){
    await sequelize.query(sql, {transaction});
}


function getConditionOrMultiple(values, attribute){
    let condition = `${attribute} = '${values.join(`' OR ${attribute} = '`)}' ` ;
    return condition;
}

// Recuperer le nombre de ligne d'une requête sql
async function getCount(sql, transaction){
    sql = sql.replace("from", "FROM");
    sql = "SELECT Count(*) as nb FROM " + sql.split("FROM")[1];
    let rep = await selectSql(sql, transaction);
    return rep[0].nb;
}


// get data connexion mysql
async function getDataByConnection(connection, sql){
    const res = await connection.promise().query(sql);
    return  res[0];
}
module.exports = {
    selectSql,
    getConditionOrMultiple,
    getCount,
    executeSql,
    getDataByConnection
}