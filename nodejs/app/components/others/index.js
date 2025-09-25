
const routes = (app)=>{
    require("./magasin/magasin.routes")(app);
    require("./caisse/caisse.routes")(app);
    require("./parametrage/modepaiement/modepaiement.routes")(app);
    require("./marketing")(app);
}

module.exports = routes;
