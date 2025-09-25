const { KIABI_SEPARATOR } = require("../utils/constant");
const { KIABI_DATATYPE } = require("../utils/fileConstant");

function getLinesFromContent(content, separator){
    if(!content)
        return [];
    separator = separator?? KIABI_SEPARATOR.line;
    const lines = content.split(separator);
    lines.splice(0, 1);
    lines.splice(lines.length - 1, 1);
    return lines;
}

function generateDataFromLine(line, columns){
    const values = line.split(KIABI_SEPARATOR.column);
    const data = {};
    for(let i = 0; i < columns.length; i++){
        const colName = columns[i].name;
        data[colName] = getValueOfColumn(values[i], columns[i]);
    }
    return data;
}

function getValueOfColumn(value, column){
    if(column.type == KIABI_DATATYPE.string)
        return value;
    if(column.type == KIABI_DATATYPE.date)
        return new Date(value);
    return getValueNumber(value, column);    
}

function getValueNumber(value, column){
    if(value == "")
        return null;
    value = parseFloat(value);
    if(isNaN(value))
        throw new Error("Valeur invalide : " + column.name);
    return value;

}

module.exports = {
    getLinesFromContent,
    generateDataFromLine
}