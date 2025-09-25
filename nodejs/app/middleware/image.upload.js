const util = require("util");
const multer = require("multer");

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/assets/uploads/images/categories");
    },
    filename: (req, file, cb) => {
        cb(null, `cat_${req.params.categoryId}_${file.originalname.replace(/ /g, "_")}`);
    },
});

let uploadImage = multer({
    storage: storage,
    // fileFilter: imageFilter,
}).single("image");

let uploadImageMiddleware = util.promisify(uploadImage);
module.exports = uploadImageMiddleware;
