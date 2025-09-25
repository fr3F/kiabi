const util = require("util");
const path = require("path");
const multer = require("multer");

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __basedir + "/assets/uploads/images/product/");
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }

        let filename = `${req.params.productId}_prod_${file.originalname.replace(/ /g, "_")}`;
        callback(null, filename);
    },
});

let uploadMultipleFiles = multer({ storage: storage }).array("images", 6);
let uploadMultipleFilesMiddleware = util.promisify(uploadMultipleFiles);
module.exports = uploadMultipleFilesMiddleware;
