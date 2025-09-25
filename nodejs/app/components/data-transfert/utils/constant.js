const { ClsCodificationFile, CatCatalogFile, ShpShipmentFile } = require("./fileConstant")

const KIABI_EXTENSION = ".DAT";
const KIABI_EXTENSION_HASH = ".MD5";

const KIABI_DIRECTORY_UPLOAD = "/PtoK";

const KIABI_DIRECTORY_ARCHIVES = "/archives";

const KIABI_SEPARATOR = {
    line: "\n",
    column: ";"
} 

const KIABI_TAG = {
    open: "<DATA>",
    close: "</DATA>"
}

const KIABI_DIRECTORIES = [
    {
        name: "KtoP",
        path: "/KtoP",
        items: [
            ClsCodificationFile,
            CatCatalogFile,
            ShpShipmentFile
        ]
    }
]

const KIABI_BACKUP_PATH = "files/data-kiabi";
const KIABI_UPLOAD_ENCODING = "latin1";

module.exports = {
    KIABI_DIRECTORIES,
    KIABI_SEPARATOR,
    KIABI_EXTENSION,
    KIABI_BACKUP_PATH,
    KIABI_EXTENSION_HASH,
    KIABI_DIRECTORY_UPLOAD,
    KIABI_TAG,
    KIABI_DIRECTORY_ARCHIVES,
    KIABI_UPLOAD_ENCODING
}