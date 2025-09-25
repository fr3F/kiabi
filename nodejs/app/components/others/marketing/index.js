const routes = (app)=>{
    require("./carte-vip/carte-vip.routes")(app);
    require("./loyact/loyact.routes")(app);
}
module.exports = routes;