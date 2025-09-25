const { selectSql } = require("../../../helpers/db.helper");
const { escape } = require("mysql2");

const CLS_TABLE = "cls_codifications";

async function getAllGroups() {
    const sql = makeSqlSelect("group");
    return await selectSql(sql);
}

async function getAllMarkets(group) {
    const sql = makeSqlSelect("market", { group });
    return await selectSql(sql);
}

async function getAllDepartments(group, market) {
    const sql = makeSqlSelect("department", { group, market });
    return await selectSql(sql);
}

async function getAllClasses(group, market, classe) {
    const sql = makeSqlSelect("class", { group, market, classe });
    return await selectSql(sql);
}

function makeSqlSelect(attribute, conditions = {}) {
    const attributes = getSelectedAttributes(attribute);
    const conditionString = makeCondition(conditions);
    return `SELECT ${attributes} FROM ${CLS_TABLE}${conditionString}`;
}

function makeCondition(conditions) {
    if (!conditions || Object.keys(conditions).length === 0) return "";
    
    return " WHERE " + Object.entries(conditions)
        .map(([key, value]) => `\`${key}\` = ${escape(value)}`)
        .join(" AND ");
}

function getSelectedAttributes(attribute) {
    return `DISTINCT \`${attribute}\` AS value, ${attribute}Description, ${attribute}LongDescription AS label`;
}

async function getClsHierrarchy() {
    
}

module.exports = {
    getAllGroups,
    getAllMarkets,
    getAllDepartments,
    getAllClasses
};
