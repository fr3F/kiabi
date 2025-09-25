const dbConfig = require("../config/environments/mysql/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    timezone: '+03:00', // your timezone comes here, ex.: 'US/Hawaii'
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./users/user.model")(sequelize, Sequelize);
db.role = require("./users/role.model")(sequelize, Sequelize);
db.userMagasin = require("./users/usermagasin.model")(sequelize, Sequelize);

db.param_num_clients = require("./gifi/paramNumClient.model")(sequelize, Sequelize)
// Inventaire
db.Inventaire = require("../components/inventaire/models/Inventaire")(sequelize, Sequelize);
db.InventaireSnapshot = require("../components/inventaire/models/inventaireSnapshot.model")(sequelize, Sequelize);
db.InventaireComptage = require("../components/inventaire/models/inventaireComptage.model")(sequelize, Sequelize);


// Inventaire
// Un inventaire peut avoir plusieurs snapshots
db.Inventaire.hasMany(db.InventaireSnapshot, { foreignKey: "idinventaire", as: "snapshots" });
db.InventaireSnapshot.belongsTo(db.Inventaire, { foreignKey: "idinventaire", as: "inventaire" });

// Un inventaire peut avoir plusieurs comptages
db.Inventaire.hasMany(db.InventaireComptage, { foreignKey: "idinventaire", as: "comptages" });
db.InventaireComptage.belongsTo(db.Inventaire, { foreignKey: "idinventaire", as: "inventaire" });

// produit
// db.produit  = require ("./produit/produit.model")(sequelize, Sequelize)
db.cat_catalogs = require("./kiabi/data/catCatalog.model")(sequelize, Sequelize)

// Caisse
// db.magasindb.magasin = require("./magasin/magasin.model")(sequelize, Sequelize);
db.magasin = require("./vente/magasin.model")(sequelize, Sequelize);


db.depot = require("./vente/parametrage/depot.model")(sequelize, Sequelize);
db.depotMagasin = require("./vente/parametrage/depotMagasin.model")(sequelize, Sequelize);
db.notifMagasin = require("./vente/parametrage/notif.model")(sequelize, Sequelize)

// db.caisse = require("./caisse/caisse.model")(sequelize, Sequelize)
// db.Caisse = require("./vente/caisse.model")(sequelize, Sequelize);

db.tableSynchro = require("./caisse/table_synchro.model")(sequelize, Sequelize)
db.tableCaisse = require("./caisse/table_caisse.model")(sequelize, Sequelize)
db.historiqueTableCaisse = require("./caisse/historique_table_caisse.model")(sequelize, Sequelize)

db.monnaies = require("./vente/parametrage/monnaie.model")(sequelize, Sequelize);


// Relation OneToMany Role, Users
db.role.hasMany(db.user, { foreignKey: "idRole", as: "users" });
db.user.belongsTo(db.role, { foreignKey: "idRole", as: "role" });


// Fonctionnalité
db.menu = require("./acces/menu.model")(sequelize, Sequelize)
db.menuRole = require("./acces/menurole.model")(sequelize, Sequelize)
db.module = require("./acces/module.model")(sequelize, Sequelize)
db.fonctionnalite = require("./acces/fonctionnalite.model")(sequelize, Sequelize)
db.fonctionnaliteRole = require("./acces/fonctionnaliteRole.model")(sequelize, Sequelize)

// KIABI
db.CatCatalog = require("./kiabi/data/catCatalog.model")(sequelize, Sequelize)
db.ClsCodification = require("./kiabi/data/clsCodification.model")(sequelize, Sequelize)
db.DataHistory = require("./kiabi/utils/history.model")(sequelize, Sequelize)
db.ShpShipment = require("./kiabi/data/shipment/shipment.model")(sequelize, Sequelize)
db.ItemShipment = require("./kiabi/data/shipment/item.model")(sequelize, Sequelize)
db.Loyact = require("./kiabi/data/loyact.model")(sequelize, Sequelize)

db.DernierNumero = require("./utils/dernierNumero.model")(sequelize, Sequelize)

// Vente
db.Magasin = require("./vente/magasin.model")(sequelize, Sequelize);
db.Caisse = require("./vente/caisse.model")(sequelize, Sequelize);

// Cloture
db.itemencaissement = require("./cloture/itemencaissement.model")(sequelize, Sequelize)
db.stock = require("./cloture/stock.model")(sequelize, Sequelize)
db.StockMagasin = require("./cloture/stockMagasin.model")(sequelize, Sequelize)
db.destinataireMail = require("./cloture/destinataireMail.model")(sequelize, Sequelize)
db.destinataireReporting = require("./cloture/destinataireReporting.model")(sequelize, Sequelize)
db.cump = require("./cloture/cump.model")(sequelize, Sequelize)
db.client = require("./cloture/client.model")(sequelize, Sequelize)
db.caractereSpeciaux = require("./cloture/caractere-special.model")(sequelize, Sequelize)
db.Prelevement = require("./cloture/prelevement.model")(sequelize, Sequelize)
db.parametrageCloture = require("./cloture/parametrage.model")(sequelize, Sequelize)
db.itemParametrageCloture = require("./cloture/item-parametrage.model")(sequelize, Sequelize)
db.utilisateurCaisse = require("./parametrage/utilisateurCaisse.model")(sequelize, Sequelize)

db.Encaissement = require("./vente/encaissement/encaissement.model")(sequelize, Sequelize);
db.Ticket = require("./vente/encaissement/ticket.model")(sequelize, Sequelize);
db.ArticleTicket = require("./vente/encaissement/articleticket.model")(sequelize, Sequelize);
db.Reglement = require("./vente/encaissement/reglement.model")(sequelize, Sequelize);
db.Loyalty = require("./vente/encaissement/loyalty.model")(sequelize, Sequelize);

// Parametrage
db.Depot = require("./vente/parametrage/depot.model")(sequelize, Sequelize);
db.DepotMagasin = require("./vente/parametrage/depotMagasin.model")(sequelize, Sequelize);
db.Monnaie = require("./vente/parametrage/monnaie.model")(sequelize, Sequelize);
db.ModePaiement = require("./vente/parametrage/modepaiement.model")(sequelize, Sequelize);
db.ModePaiementStandard = require("./vente/parametrage/modepaiementStandard.model")(sequelize, Sequelize);

// Client VIP
db.clientVip = require("./gifi/clientvip.model")(sequelize, Sequelize)
db.ParametrageVip = require("./others/marketing/vip/parametrage.model")(sequelize, Sequelize);
db.HistoriqueParamVip = require("./others/marketing/vip/historiqueParametrage.model")(sequelize, Sequelize);
db.HistoriquePointVip = require("./others/marketing/vip/historiquePoint.model")(sequelize, Sequelize);
db.ParamNumClient = require("./gifi/paramNumClient.model")(sequelize, Sequelize)


// Relation one to many menu
db.menu.hasMany(db.menu, { foreignKey: "parentId", as: "subItems"});
db.menu.belongsTo(db.menu, { foreignKey: "parentId", as: "parent"});

// Relation many to many menu/roles

db.role.belongsToMany(db.menu, { foreignKey: "roleId", as: "menus", through: db.menuRole, timestamps: false});
db.menu.belongsToMany(db.role, { foreignKey: "menuId", as: "roles", through: db.menuRole, timestamps: false});

// Relation one to many module fonctionnalite
db.module.hasMany(db.fonctionnalite, { foreignKey: "moduleId", as: "fonctionnalites"});
db.fonctionnalite.belongsTo(db.module, { foreignKey: "moduleId", as: "module"});

// Relation many to many fonctionnalite/roles
db.role.belongsToMany(db.fonctionnalite, { foreignKey: "roleId", as: "fonctionnalites", through: db.fonctionnaliteRole, timestamps: false});
db.fonctionnalite.belongsToMany(db.role, { foreignKey: "fonctionnaliteId", as: "roles", through: db.fonctionnaliteRole, timestamps: false});

db.user.hasMany(db.DataHistory, { foreignKey: "idUser", as: "dataHistories"});
db.DataHistory.belongsTo(db.user, { foreignKey: "idUser", as: "user"});

db.ShpShipment.hasMany(db.ItemShipment, { foreignKey: "idShipment", as: "items"});
db.ItemShipment.belongsTo(db.ShpShipment, { foreignKey: "idShipment", as: "shipment"});

db.Magasin.hasMany(db.Caisse, { foreignKey: "idMagasin", as: "caisses"});
db.Caisse.belongsTo(db.Magasin, { foreignKey: "idMagasin", as: "magasin"});

// console.log("Associations de Caisse :", Object.keys(db.Caisse.associations)); 

db.Encaissement.hasMany(db.Ticket, { foreignKey: "idencaissement", as: "tickets"});
db.Ticket.belongsTo(db.Encaissement, { foreignKey: "idencaissement", as: "encaissement"});

db.Ticket.hasMany(db.ArticleTicket, { foreignKey: "idticket", as: "articles"});
db.ArticleTicket.belongsTo(db.Ticket, { foreignKey: "idticket", as: "ticket"});

db.Ticket.hasMany(db.Reglement, { foreignKey: "idticket", as: "reglements"});
db.Reglement.belongsTo(db.Ticket, { foreignKey: "idticket", as: "ticket"});

db.Ticket.hasOne(db.Loyalty, { foreignKey: "idticket", as: "loyalty"});
db.Loyalty.belongsTo(db.Ticket, { foreignKey: "idticket", as: "ticket"});

// Relation many to many fonctionnalite/roles
db.Depot.belongsToMany(db.Magasin, { foreignKey: "idDepot", as: "magasins", through: db.DepotMagasin, timestamps: false});
db.Magasin.belongsToMany(db.Depot, { foreignKey: "idMagasin", as: "depots", through: db.DepotMagasin, timestamps: false});

// Relation many to many fonctionnalite/roles
db.user.belongsToMany(db.magasin, { foreignKey: "idUser", as: "magasins", through: db.userMagasin, timestamps: false});
db.magasin.belongsToMany(db.user, { foreignKey: "idMagasin", as: "userMagasins", through: db.userMagasin, timestamps: false});

db.user.hasMany(db.HistoriqueParamVip, { foreignKey: "idUser", as: "histoParamsVip"});
db.HistoriqueParamVip.belongsTo(db.user, { foreignKey: "idUser", as: "user"});

// Cloture
db.Encaissement.hasMany(db.itemencaissement, { foreignKey: "idencaissement", as: "items"});
db.itemencaissement.belongsTo(db.Encaissement, { foreignKey: "idencaissement", as: "encaissement"});

db.Encaissement.hasMany(db.Prelevement, { foreignKey: "idencaissement", as: "prelevements"});
db.Prelevement.belongsTo(db.Encaissement, { foreignKey: "idencaissement", as: "encaissement"});

db.Magasin.hasOne(db.itemParametrageCloture, { foreignKey: "idMagasin", as: "parametrageCloture"});
db.itemParametrageCloture.belongsTo(db.Magasin, { foreignKey: "idMagasin", as: "magasin"});

db.parametrageCloture.hasMany(db.itemParametrageCloture, { foreignKey: "idParametrage", as: "items"});
db.itemParametrageCloture.belongsTo(db.parametrageCloture, { foreignKey: "idParametrage", as: "parametrage"});

db.utilisateurCaisse.hasMany(db.Encaissement, { foreignKey: "idcaissier", as: "encaissements"});
db.Encaissement.belongsTo(db.utilisateurCaisse, { foreignKey: "idcaissier", as: "caissier"});

// Logs
db.historique = require("./log/historique.model")(sequelize, Sequelize)
db.logCaisse = require("./log/logs_caisse.model")(sequelize, Sequelize)

module.exports = db;
