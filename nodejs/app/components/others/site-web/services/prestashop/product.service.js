const { ErrorCode } = require("../../../../../helpers/error");
const { prestashopAPI } = require("./util");
 
const findProductByReference = async (reference) => {
    const response = await prestashopAPI.products.find({
        filters: [{ key: "reference", value: reference }]
    });
    const product = response.data;
    verifyProductIsNull(product);
    return product;  
};

function verifyProductIsNull(product){
    if(!product)
        throw new ErrorCode("Le produit est introuvable sur le site");
}

const findProductById = async (id) => {
    const response = await prestashopAPI.products.get(id);  
    const product = response.data;
    verifyProductIsNull(product);
    return product;
};

module.exports = {
    findProductByReference,
    findProductById
}