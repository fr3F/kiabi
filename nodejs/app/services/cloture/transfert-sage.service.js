const db = require("./../../models");
const { isDate } = require("../../helpers/form.helper");
const helper = require("../../helpers/helpers.helper");
const { selectSql } = require("../../helpers/db.helper");
const { Op } = require("sequelize");

const sequelize = db.sequelize;

const ArticleTicket = db.ArticleTicket;
const Ticket = db.Ticket;
const Encaissement = db.Encaissement;

async function getEncaissementARegulariser(date, idParametrage){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const parametrage = await getConditionParametrage(idParametrage);
    const itemTickets = await getItemsTicketTransfert(date, parametrage);
    const exist = itemTickets.length != 0;
    let itemARegulariser = itemTickets.filter((r)=> r.ecart < 0);
    itemARegulariser = helper.regroupByAttribut(itemARegulariser, "depot");
    return {itemARegulariser , exist};
}

async function getConditionParametrage(idParametrage){
    const parametrage = await helper.verifierExistence(db.parametrageCloture, idParametrage, "Paramétrage", 
        [{model: db.itemParametrageCloture, as: "items", include: ["magasin"]}]
    );
    const nommagasins = parametrage.items.map((r)=> `'${r.magasin.nommagasin}'`);
    return ` magasin IN(${nommagasins.join(', ')})`;
}

async function getItemsTicketTransfert(date, parametrage){
    const sql = `SELECT t.*, (COALESCE(s.quantite, 0) + t.quantite) quantiteStock, (COALESCE(s.quantite, 0)) ecart
    FROM
        (
            SELECT depot, code, designation, coalesce(gamme, '') gamme,
                        SUM(quantite) quantite
                        FROM v_itemticket_encaissement
                    WHERE
                        date(dateEncaissement) = date('${helper.formatDate(date, 'YYYY-MM-DD')}')
                        AND ${parametrage}
                    GROUP BY depot, code, designation, coalesce(gamme, '')
        ) t
        LEFT JOIN 
        stockmagasin s 
        ON(s.reference = t.code AND coalesce(s.gamme, '') = t.gamme AND TRIM(t.depot) = TRIM(s.depot))
        ORDER BY t.depot
        `;
    return await selectSql(sql);
}

async function getResumeJour(date, idParametrage){
    const parametrage = await getConditionParametrage(idParametrage);
    const rep = await getDataArticleResume(date, parametrage);
    const dataTickets = await getDataTicketResume(date, parametrage);
    for(let item of rep){
        const dataTicket = dataTickets.find(r=> r.magasin == item.magasin && r.codeclient == item.codeclient);
        if(dataTicket){
            item.nbTicket = dataTicket.nbTicket;
            item.montanttotal = dataTicket.montanttotal;
        }
    }
    return rep;
}

async function getSommaireReglement(date, idParametrage){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const parametrage = await getConditionParametrage(idParametrage);
    const sql = `SELECT magasin, modepaiement, SUM(montantreglement) montantreglement
                    FROM v_reglements_encaissement_date
                    WHERE 
                        date(dateEncaissement) = date('${helper.formatDate(date, 'YYYY-MM-DD')}')
                        AND ${parametrage}
                    GROUP BY magasin, modepaiement 
                    ORDER BY magasin`;
    return await selectSql(sql);
}



async function getSommaireReglementMagasin(date, idMagasin){
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    const magasin = await helper.verifierExistence(db.Magasin, idMagasin, "Magasin");
    const sql = `SELECT modepaiement, SUM(montantreglement) montantreglement
                    FROM v_reglements_encaissement_date
                    WHERE 
                        date(dateEncaissement) = date('${helper.formatDate(date, 'YYYY-MM-DD')}')
                        AND magasin = '${magasin.nommagasin}'
                    GROUP BY modepaiement`;
    return await selectSql(sql);
}


async function getDataArticleResume(date, parametrage){
    const sql = `SELECT  t.*, minicentrale
            FROM    
            (
                SELECT magasin, codeclient, count(distinct code) nbReferenceArticle, 
                            sum(quantite) qteVendu 
                        FROM v_itemticket_encaissement  
                        WHERE
                                date(dateEncaissement) = date('${helper.formatDate(date, 'YYYY-MM-DD')}')
                                AND ${parametrage}
                        GROUP BY magasin, codeclient
            ) t 
            JOIN magasin m ON(m.nommagasin = t.magasin)`;
    return await selectSql(sql);
}

async function getDataTicketResume(date, parametrage){
    const sql = `SELECT magasin, codeclient, count(numticket) nbTicket, 
                    sum(montanttotal) montanttotal 
                FROM v_ticket_encaissement  
                WHERE
                        date(dateEncaissement) = date('${helper.formatDate(date, 'YYYY-MM-DD')}')
                        AND ${parametrage}
                GROUP BY magasin, codeclient`;
    return await selectSql(sql);
}


async function getDetailTicketJourMagasin(date, magasin, client){
    await helper.verifierExistence(db.Magasin, magasin, "Magasin", [], null, "nommagasin");
    if(!isDate(date))
        throw new Error("Veuillez renseigner la date")
    let rep =  await ArticleTicket.findAll({
        where: {
            [Op.and]: [
                sequelize.where(sequelize.fn('date', sequelize.col('ticket.encaissement.createdAt')), sequelize.fn('date', date)),
                {"$ticket.magasin$": magasin},
                {"$ticket.codeclient$": client}
            ]
        },
        order: [[{model: Ticket, as: "ticket"}, "nocaisse"]],
        include: [{
            model: Ticket,
            as: "ticket",
            include: [{model: Encaissement, as: "encaissement", include: ["caissier"]}]
        }]
    });
    rep = helper.dataToJson(rep);
    setRemise(rep);
    return rep;
}

function setRemise(articles){
    for(const article of articles){
        article.remise = 100 * article.montantremise / article.prixtotal;   
    }
}
module.exports = {
    getEncaissementARegulariser,
    getResumeJour,
    getSommaireReglement,
    getDetailTicketJourMagasin,
    getSommaireReglementMagasin
}
