const { QueryTypes, Op } = require("sequelize/dist");
const db = require("../models");
const prodServ = require("./catalog/product.service")

const sequelize = db.sequelize;

// Obtenir le total de montantapayer et nombre de commande par status
async function getTotalCommande(status, cond){
    if(!cond) cond = {};
    cond.status = status;
    let rep = await db.orders.findOne({
        where: cond,
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'nb_total'],
            [sequelize.fn('COALESCE',
                sequelize.fn('SUM', sequelize.col('montantapayer')), 0)
            ,'montant_total'],
          ]
    });
    return rep;
}

// Obtenir les tops 10 des produits plus commandés
async function getProduitsPlusCommande(req){
    let cond = getConditionDateSql(req);
    let user = req.user;
    let joinRemise = "";
    let remise = "";
    if(user&&user.clientId){
        remise = ", coalesce(r.remise, 0) remise ";
        joinRemise = " left JOIN remisecategories r on(r.idClient = " + user.clientId + " and r.idCategorie = p.categoryId) "
    }
    // console.log("*****************************")
    // console.log(user)
    // let sql = "select * from v_nb_produits_commande_full order by quantite desc limit 10";
    let sql = "select p.id, p.code, p.designation, p.newprice, p.description, p.oldprice, p.nouveaute, p.categoryId, c.name categoryName, coalesce(v.quantite, 0) quantite, coalesce(v.montanttotal, 0) montanttotal, p.gammeId " + remise + 
                "from products p left join (" +
                "select oi.code, sum(oi.quantite) as quantite, sum(oi.montanttotal) montanttotal " +
                "from orderitems oi join orders o on(o.id = oi.orderId " + cond + " and o.status='cloture')" + 	 
                "group by oi.code" + 
                ") v on(p.code = v.code)"+
                "join categories c on(c.id = p.categoryId)" + joinRemise + 
                "where quantite > 0  order by quantite desc limit 10";
                // console.log("******************************************************")
                // console.log(sql)
    let rep = await sequelize.query(sql, {type: QueryTypes.SELECT});
    rep = await prodServ.getProductImages(rep);
    return rep;
}

// Verification de date de debut et date de fin pour dashboard
function testDate(dateDebut, dateFin){
    if(prodServ.isDate2(dateFin)&&prodServ.isDate2(dateDebut)){
        if(new Date(dateDebut)> new Date(dateFin))
            throw new Error("La date de début doit être inférieure à la date de fin");
    }
}

// Recuperer la condition pour la date de debut et date de fin pour dashboard
function getConditionDate(req){
    let {dateDebut, dateFin} = req.query;
    testDate(dateDebut, dateFin);
    if(dateDebut && dateFin)
        return {createdAt:{[Op.lte]: dateFin, [Op.gte]: dateDebut}}
    else if(dateDebut)
        return {createdAt:{[Op.gte]: dateDebut}}
    else if(dateFin)
        return {createdAt:{[Op.lte]: dateFin}}
    return null;
}

// Recuperer la condition pour la date de debut et date de fin pour dashboard par sql
function getConditionDateSql(req){
    let rep = "";
    let {dateDebut, dateFin} = req.query;
    testDate(dateDebut, dateFin);
    if(dateDebut)
        rep +=" AND o.createdAt >= '" + dateDebut + "'"
    if(dateFin)
        rep +=" AND o.createdAt <= '" + dateFin + "'"
    return rep;
}

// Obtenir le nombre total des nouveaux clients 
async function getNbClientTotalInscrit(req){
    let cond = getConditionDate(req);
    if(!cond) cond = {};
    cond.status = "nouveau"
    let rep = await db.customers.findOne({
        where: cond,
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'nb'],
          ]
    });
    return rep;
}

// Obtenir le nombre total de tous les clients 
async function getNbClientTotal(){
    let rep = await db.customers.findOne({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'nb'],
          ]
    });
    return rep;
}

// Obtenir les informations relatives au tableau de bord concernant les commandes
async function getDashboardCommande(req){
    let cond = getConditionDate(req);
    let nouvelle = await getTotalCommande("nouvelle", cond);
    let valide = await getTotalCommande("valide", cond);
    let cloture = await getTotalCommande("cloture", cond);
    let annule = await getTotalCommande("annule", cond);
    return {nouvelle, valide, cloture, annule};
}

// Obtenir les informations relatives au tableau de bord concernant les clients
async function getDashboardClient(req){
    let total = await getNbClientTotal();
    let totalInscrit = await getNbClientTotalInscrit(req);
    let r = {
        total:JSON.parse(JSON.stringify(total)).nb , 
        inscrit: JSON.parse(JSON.stringify(totalInscrit)).nb
    };
    return r;
}

module.exports = {
    getDashboardClient,
    getDashboardCommande,
    getProduitsPlusCommande
}