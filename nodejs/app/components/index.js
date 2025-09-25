
const routes = (app)=>{
    require("./data-transfert/data-transfert.routes")(app);
    require("./catalogs/catalog.routes")(app);
    require("./shipments/shipment.routes")(app);
    require("./sales/sale.routes")(app);
    require("./others")(app);
}

module.exports = routes;
