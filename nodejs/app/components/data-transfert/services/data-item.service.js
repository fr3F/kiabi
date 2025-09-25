const { sequelize } = require("../../../models");
const { insertImportSuccessHistory } = require("./history.service");
const { getLinesFromContent, generateDataFromLine } = require("./util.service")

async function updateDataWithItems(item, filename, directory, fileContent) {
    const lines = getLinesFromContent(fileContent, item.lineSeparator);
    if(!lines.length)
        return;
    const parent = generateDataParent(item, lines, filename);
    const items = generateDataItems(item, lines);
    await insertData(item, filename, directory, parent, items);
}

function generateDataParent(item, lines, filename){
    const parent = generateDataFromLine(lines[0], item.columns);
    parent.filename = filename;
    parent.status = item.defaultStatus;
    return parent;
}

function generateDataItems(item, lines){
    const resp = [];
    for(let i = 1; i < lines.length; i++){
        resp.push(generateDataItem(item, lines[i]));
    }
    return resp;
}

function generateDataItem(item, line){
    const resp = generateDataFromLine(line, item.itemColumns);
    return resp;
}

async function insertData(item, filename, directory, parent, items) {
    await sequelize.transaction(async (transaction)=>{
        const tmp = await item.model.create(parent, { transaction });
        await insertItems(item, items, tmp.id, transaction);        
        await insertImportSuccessHistory(item, filename, directory, transaction);
    })
}

async function insertItems(item, items, idParent, transaction) {
    if(!items.length)
        return;
    setForeignKeyItems(items, idParent, item.foreignKey);
    await item.itemModel.bulkCreate(items, { transaction });
}

function setForeignKeyItems(items, idParent, foreignKeyColumn){
    for(const item of items){
        item[foreignKeyColumn] = idParent;
    }
}

module.exports = {
    updateDataWithItems
}