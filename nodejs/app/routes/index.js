const routes = (app)=>{
    require("./users/auth.routes")(app);
    require("./users/user.routes")(app);
    require("./acces/menu")(app);
    require("./../components")(app);

    require("./gifi/client-vip.routes")(app);

    require("./cloture")(app);
    require("./reporting/reporting.routes")(app);
    
    require("./caisse/caisse.routes")(app);

    require("./parametrage/devis.routes")(app);

    require("./util/produit.routes")(app);
    require("../components/inventaire/routes/inventaire.routes")(app);
    require("../components/inventaire/routes/InventaireSnapshot.routes")(app);
    require("../components/inventaire/routes/inventaireSurplus.routes")(app);
    
    // require("./dashboard/dashboard.routes")(app);

}
module.exports = routes;