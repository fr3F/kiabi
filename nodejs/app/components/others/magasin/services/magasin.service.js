const { verifierExistence } = require("../../../../helpers/helpers.helper");
const { Magasin } = require("../../../../models");

async function getAllMagasins() {
    return await Magasin.findAll();
}

async function findAndVerifyMagasin(idMagasin) {
    return await verifierExistence(Magasin, idMagasin, "Magasin");
}

module.exports = {
    getAllMagasins,
    findAndVerifyMagasin
}