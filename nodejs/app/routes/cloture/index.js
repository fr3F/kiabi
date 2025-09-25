const routes = (app)=>{
    require("./encaissement.routes")(app);
    require("./parametrage.routes")(app);

}
module.exports = routes;