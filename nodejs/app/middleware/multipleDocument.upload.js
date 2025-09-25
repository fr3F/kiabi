const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/assets/uploads/documents/");
    },
    filename: (req, file, cb) => {
        let originalname = file.originalname;
        cb(null, `doc-cli_${req.params.customerId}_${originalname.replace(/ /g, "_")}`);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).array("files", 3);

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
