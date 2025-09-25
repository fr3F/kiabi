const LOYACT_ACTION = {
    cardCreation: 1,
    cardBlocking: 2,
    cardTransfert: 3,
    ptReadjust: 4
}

const LOYACT_ORIGIN = {
    web: 1,
    store: 2
}

const BLOCKING_CAUSE = {
    loss: 1,
    theft: 2,
    customerRequest: 3
}

const TRANSFERT_CAUSE = {
    loss: 1,
    theft: 12,
    customerRequest: 13
}

const READJUST_CAUSE = {
    ticket: 1,
    birthday: 2,
    birth: 3,
    welcome: 4,
    marketing: 5
}

const LOAYCT_HEADER = "NO_CARTE;DATE;ACTION;OPTIN_FID;NEW_NO_CARTE;ORIGINE;MAG;CODE_ETAB;NB_POINTS;CAUSE";
const CREATION_CAUSE = 1;

const FILE_LOYACT_PREFIX = "LOYACT";
const FILE_LOYACT_EXT = ".csv";

const FILE_LOYACT_SEPARATOR = {
    line: "\r\n",
    column: ";"
}

const POINT_LABEL = {
    creation: "Creation",
    anniv: "Anniversary",
    birth: "Birth",
    welcome: "Welcome",
    marketing: "Marketing"
}

module.exports = {
    LOYACT_ACTION,
    LOYACT_ORIGIN,
    BLOCKING_CAUSE,
    TRANSFERT_CAUSE,
    READJUST_CAUSE,
    LOAYCT_HEADER,
    CREATION_CAUSE,
    FILE_LOYACT_PREFIX,
    FILE_LOYACT_EXT,
    FILE_LOYACT_SEPARATOR,
    POINT_LABEL
}