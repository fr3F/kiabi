const verifyCodeProduit = (req, res, next) => {
    if(!req.params.code && !req.query.code)
        return res.status(400).send({
            message: "Veuillez renseigner le code"
        });
    next();
}

module.exports = {
    verifyCodeProduit
};