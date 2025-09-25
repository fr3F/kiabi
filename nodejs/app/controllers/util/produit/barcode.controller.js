const { findBarcode } = require("../../../services/util/barcode.service");
const barcodeService = require("../../../services/util/produit/barcode/barcode.service");
const { sendError, setHeaderResponseAttachementPdf } = require("../../../helpers/helpers.helper");
const { generateBarcode } = require("../../../services/util/produit/barcode/generate.service");
const { importBarcodeFromFile } = require("../../../services/util/produit/barcode/import.service");
const { verifierAccesConnecte } = require("../../../services/acces/fonctionnalite.service");
const { ACCES_PRODUIT } = require("./util");
const { imprimerBarcodes } = require("../../../services/util/produit/barcode/print/print-multiple.service");
const { printOneBarcode, printOneBarcodeGifi } = require("../../../services/util/produit/barcode/print/print-one.service");


// Gestion des code barre
exports.findBarcode = async (req, res) => {
    try{
        let resp = await findBarcode(req.params.barcode);
        res.send(resp);
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
};

exports.createBarcode = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.manageBarcode, req, res))
            return;   
        let resp = await barcodeService.createBarcode(req.params.code, req.body);
        res.send(resp);
    }
    catch(err){
        sendError(res, err)
    }
};

exports.updateBarcode = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.manageBarcode, req, res))
            return;   
        let resp = await barcodeService.updateBarcode(req.params.id, req.body);
        res.send(resp);
    }
    catch(err){
        sendError(res, err)
    }
};

exports.deleteBarcode = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.manageBarcode, req, res))
            return;   
        let resp = await barcodeService.deleteBarcode(req.params.id);
        res.send({message: "Deleted"});
    }
    catch(err){
        sendError(res, err)
    }
};


exports.deleteBarcodeGifi = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.manageBarcode, req, res))
            return;   
        let resp = await barcodeService.deleteBarcodeGifi(req.params.id);
        res.send({message: "Deleted"});
    }
    catch(err){
        sendError(res, err)
    }
};
exports.generateBarcode = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.manageBarcode, req, res))
            return;   
        let resp = await generateBarcode();
        res.send(resp);
    }
    catch(err){
        sendError(res, err)
    }
};

exports.importBarcode = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.manageBarcode, req, res))
            return;   
        let resp = await importBarcodeFromFile(req.body.file);
        res.send(resp);
    }
    catch(err){
        sendError(res, err)
    }
};



exports.printBarcodes = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.manageBarcode, req, res))
            return;   
        const { stream } = await imprimerBarcodes(req.body.barcodes, req.user);
        const filename = `Barcode.pdf`;
        setHeaderResponseAttachementPdf(res, filename);
        stream.pipe(res);
    }
    catch(err){
        sendError(res, err);
    }
};



exports.printOneBarcode = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.printBarcode, req, res))
            return;   
        const { stream } = await printOneBarcode(req.params.id, req.query.nombre, req.user);
        const filename = `Barcode.pdf`;
        setHeaderResponseAttachementPdf(res, filename);
        stream.pipe(res);
    }
    catch(err){
        sendError(res, err)
    }
};

exports.printOneBarcodeGifi = async (req, res) => {
    try{
        if(!await verifierAccesConnecte(ACCES_PRODUIT.printBarcode, req, res))
            return;   
        const { stream } = await printOneBarcodeGifi(req.params.id, req.query.nombre, req.user);
        const filename = `Barcode.pdf`;
        setHeaderResponseAttachementPdf(res, filename);
        stream.pipe(res);
    }
    catch(err){
        sendError(res, err)
    }
};
