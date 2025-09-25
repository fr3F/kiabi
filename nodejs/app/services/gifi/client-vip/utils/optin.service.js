

const OPTIN_COLUMNS = {
    smsKiabi: "optinSmsKiabi",
    smsPartner: "optinSmsPartner",
    emailKiabi: "optinEmailKiabi",
    emailPartner: "optinEmailPartner"
}

function setClientDateOptinOptouts(client, oldClient){
    setDateOptinOptout(client, oldClient, OPTIN_COLUMNS.smsKiabi);
    setDateOptinOptout(client, oldClient, OPTIN_COLUMNS.smsPartner);
    setDateOptinOptout(client, oldClient, OPTIN_COLUMNS.emailKiabi);
    setDateOptinOptout(client, oldClient, OPTIN_COLUMNS.emailPartner);
}

function setDateOptinOptout(client, oldClient, column){
    if(!oldClient || oldClient[column] != client[column]){
        if(client[column])
            setDateOptin(client, column);
        else{
            client[column] = false;
            setDateOptout(client, column);
        }
    }
}

function setDateOptin(client, column){
    const dateColumn = getDateColumn(column, "optin");
    client[dateColumn] = new Date();
}

function setDateOptout(client, column){
    const dateColumn = getDateColumn(column, "optout");
    client[dateColumn] = new Date();
}

function getDateColumn(column, prefix){
    let resp = column.replace("optin", prefix);
    return `date${capitalizeFirstLetter(resp)}`;
}

function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    setClientDateOptinOptouts
}