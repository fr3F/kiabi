const { sequelize } = require("../../../models"); // ton instance Sequelize

class InventaireAnomalieService {

  // ---------------------- getIntrouvable ----------------------

 async getIntrouvable(idinventaire) {
  if (!idinventaire) {
    throw new Error("⚠️ idinventaire est obligatoire");
  }

  const query = `
    select  sum(introuvable) AS total_introuvable from (
    SELECT 
    ((SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=i.idinventaire and eanCode=snap.eanCode) - snap.stock ) 	as introuvable
    FROM kiabi.inventaire_snapshot snap 
    left join kiabi.inventaire i on i.idinventaire = snap.idinventaire
    WHERE i.idinventaire=:idinventaire AND 
    (SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=i.idinventaire and eanCode=snap.eanCode)  > 0
    ) as b where introuvable > 0 ;
  `;

  const result = await sequelize.query(query, {
    replacements: { idinventaire },
    type: sequelize.QueryTypes.SELECT
  });

  // Retourne le total ou 0 si null
  return Number(result[0]?.total_introuvable || 0);
}

  // ---------------------- getSurplusNonExistant ----------------------
  async  getSurplusNonExistant(idinventaire) {
    if (!idinventaire) {
      throw new Error("⚠️ idinventaire est obligatoire");
    }

    const query = `
      select sum(surplusnonexistant) as surplus from (
      SELECT COUNT(epc) as surplusnonexistant FROM inventaire_comptage where eanCode not in (
      SELECT eanCode FROM inventaire_snapshot where idinventaire=:idinventaire
      ) AND idinventaire=:idinventaire group by eanCode) as a;
    `;

    const result = await sequelize.query(query, {
      replacements: { idinventaire },
      type: sequelize.QueryTypes.SELECT
    });

    // Récupère le total ou 0 si null
    return Number(result[0]?.surplus || 0);
  }


  async getOverStockWithTotal(idinventaire) {
    if (!idinventaire) {
      throw new Error("⚠️ idinventaire est obligatoire et ne doit pas être null/undefined");
    }

    const query = `
  
      select  sum(surplus) as total_surplus from (
      SELECT snap.stock as theorique, (
      SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=:idinventaire and eanCode=snap.eanCode) as inventaire,
      ((SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=:idinventaire and eanCode=snap.eanCode) - snap.stock ) 	as surplus
      FROM kiabi.inventaire_snapshot snap 
      left join kiabi.inventaire i on i.idinventaire = snap.idinventaire
      WHERE i.idinventaire=:idinventaire) as a;

    `;

    const result = await sequelize.query(query, {
      replacements: { idinventaire },
      type: sequelize.QueryTypes.SELECT
    });

    const total_count = Number(result[0]?.total_surplus || 0);

    return { rows: [], total_count };
  }



  async surplusTotal(idinventaire) {
    if (!idinventaire) {
      throw new Error("⚠️ idinventaire est obligatoire");
    }

    // Appeler les fonctions avec l'idinventaire
    const totalAbsent = await this.getSurplusNonExistant(idinventaire); 
    const overStockData = await this.getOverStockWithTotal(idinventaire);
    // const getIntrouvable = await this.getIntrouvable(idinventaire);

    const totalOverStock = overStockData?.total_count || 0;

    // Somme totale

    const totalSurplus = totalOverStock + totalAbsent  ;

    console.log("totalAbsent:", totalAbsent);
    console.log("totalOverStock:", totalOverStock);

    console.log(totalOverStock + totalAbsent);
    
    console.log("totalSurplus", totalSurplus);
    // console.log("getIntrouvable", getIntrouvable);
    
    // console.log("calculerProgressInventaire", await calculerProgressInventaire(idinventaire));
    
    return totalSurplus;
  }

}

module.exports = InventaireAnomalieService;
