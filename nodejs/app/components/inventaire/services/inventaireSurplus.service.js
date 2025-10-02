const { sequelize } = require("../../../models"); // ton instance Sequelize
const inventaireService = require("./inventaire.service");

class InventaireAnomalieService {
  async getIntrouvable(idinventaire) {
    if (!idinventaire) throw new Error("idinventaire est obligatoire");

    const query = `
      select sum(introuvable) AS total_introuvable from (
      SELECT 
      (snap.stock - (SELECT count(epc) as inventaire 
                    FROM inventaire_comptage 
                    where idinventaire=i.idinventaire and eanCode=snap.eanCode)) as introuvable
      FROM inventaire_snapshot snap 
      left join inventaire i on i.idinventaire = snap.idinventaire
      WHERE i.idinventaire=:idinventaire 
        AND (SELECT count(epc) 
             FROM inventaire_comptage 
             where idinventaire=i.idinventaire and eanCode=snap.eanCode) > 0
      ) as b 
      where introuvable > 0;
    `;

    const result = await sequelize.query(query, {
      replacements: { idinventaire },
      type: sequelize.QueryTypes.SELECT,
    });

    return Number(result[0]?.total_introuvable || 0);
  }

  async getSurplusNonExistant(idinventaire) {
    if (!idinventaire) throw new Error("idinventaire est obligatoire");

    const query = `
      select sum(surplusnonexistant) as surplus from (
      SELECT COUNT(epc) as surplusnonexistant FROM kiabi.inventaire_comptage where eanCode not in (
      SELECT eanCode FROM kiabi.inventaire_snapshot where idinventaire=:idinventaire
      ) AND idinventaire=:idinventaire group by eanCode) as a;
    `;

    const result = await sequelize.query(query, {
      replacements: { idinventaire },
      type: sequelize.QueryTypes.SELECT,
    });

    return Number(result[0]?.surplus || 0);
  }

  async getSurplusCount(idinventaire) {
    if (!idinventaire) throw new Error("idinventaire est obligatoire et ne doit pas être null/undefined");

    const query = `
      select  sum(surplus) as surplus from (
      SELECT snap.stock as theorique, (
      SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=:idinventaire and eanCode=snap.eanCode) as inventaire,
      ((SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=:idinventaire and eanCode=snap.eanCode) - snap.stock) 	as surplus
      FROM kiabi.inventaire_snapshot snap 
      left join kiabi.inventaire i on i.idinventaire = snap.idinventaire
      WHERE i.idinventaire=:idinventaire and ((SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=11 and eanCode=snap.eanCode) - snap.stock)>0) as a;
    `;

    const result = await sequelize.query(query, {
      replacements: { idinventaire },
      type: sequelize.QueryTypes.SELECT,
    });


    return Number(result[0]?.surplus || 0);
  }

  async surplusTotal(idinventaire) {
    if (!idinventaire) throw new Error("idinventaire est obligatoire");

    const totalAbsent = await this.getSurplusNonExistant(idinventaire);
    const overStockData = await this.getSurplusCount(idinventaire);

    const totalOverStock = overStockData || 0;
    const totalSurplus = totalOverStock + totalAbsent;

    return totalSurplus;
  }

  // ---------------------- initial ----------------------
  async initial(idinventaire) {
    if (!idinventaire) throw new Error("idinventaire est obligatoire");

    const [introuvable, surplusnonExistant, surplus, progress] = await Promise.all([
      this.getIntrouvable(idinventaire),
      this.getSurplusNonExistant(idinventaire),
      this.getSurplusCount(idinventaire),
      inventaireService.calculerProgressInventaire(idinventaire),
    ]);

    return {
      introuvable,
      surplusnonExistant,
      surplus,
      surplusTotal: surplusnonExistant + surplus,
      progress,
    };
  }
}

module.exports = InventaireAnomalieService;
