const db = require("../../../models");
const { sequelize } = require("../../../models");

module.exports = {

  
  async getCountIntrouvable(idinventaire) {
    const query = `
      select sum(surplusnonexistant) as surplus from (
      SELECT COUNT(epc) as surplusnonexistant FROM kiabi.inventaire_comptage where eanCode not in (
      SELECT eanCode FROM kiabi.inventaire_snapshot where idinventaire=:idinventaire
      ) AND idinventaire=:idinventaire group by eanCode) as a;
    `;

    const [result] = await sequelize.query(query, {
      replacements: { idinventaire },
      type: sequelize.QueryTypes.SELECT
    });

    return result.surplus || 0;
  },

async calculerProgressInventaire(idinventaire) {
  if (!idinventaire) {
    throw new Error("⚠️ idinventaire est obligatoire");
  }

  const query = `
    select sum(theorique)/(sum(inventaire) - sum(surplus))*:idinventaire as avancement from (
      SELECT snap.stock as theorique, 
        (SELECT count(epc) as inventaire 
         FROM kiabi.inventaire_comptage 
         WHERE idinventaire=:idinventaire and eanCode=snap.eanCode) as inventaire,
        ((SELECT count(epc) as inventaire 
          FROM kiabi.inventaire_comptage 
          WHERE idinventaire=:idinventaire and eanCode=snap.eanCode) - snap.stock) as surplus
      FROM kiabi.inventaire_snapshot snap 
      LEFT JOIN kiabi.inventaire i on i.idinventaire = snap.idinventaire
      WHERE i.idinventaire=:idinventaire
    ) as a;
  `;

  const result = await sequelize.query(query, {
    replacements: { idinventaire },
    type: sequelize.QueryTypes.SELECT
  });

  const avancement = Number(result[0]?.avancement || 0);
  return  avancement;
}
,
async getSurplusNegatif(idinventaire ) {
  const query = `

 (
    SELECT 
        snap.idinventaire,
        snap.eanCode,
        snap.stock AS theorique,
        COUNT(ic.epc) AS counted_qty,       
        (COUNT(ic.epc) - snap.stock) AS surplus,
        snap.designation,
        snap.color,
        snap.size,
        snap.styleCode,
        MAX(ic.datemodification) AS dateinventaire
    FROM kiabi.inventaire_snapshot snap
    LEFT JOIN kiabi.inventaire i 
        ON i.idinventaire = snap.idinventaire
    LEFT JOIN kiabi.inventaire_comptage ic
        ON ic.idinventaire = i.idinventaire
       AND ic.eanCode = snap.eanCode
    WHERE snap.idinventaire = :idinventaire
    GROUP BY 
        snap.idinventaire,
        snap.eanCode,
        snap.stock,
        snap.designation,
        snap.color,
        snap.size,
        snap.styleCode
    HAVING (COUNT(ic.epc) - snap.stock) > 0
)

UNION ALL

(
    SELECT 
        :idinventaire AS idinventaire,
        ic.eanCode,
        0 AS theorique,
        ic.inventaire AS counted_qty,       -- Ajouté ici
        ic.inventaire AS surplus,
        NULL AS designation,
        NULL AS color,
        NULL AS size,
        NULL AS styleCode,
        NULL AS dateinventaire
    FROM (
        SELECT eanCode, COUNT(epc) AS inventaire
        FROM kiabi.inventaire_comptage
        WHERE idinventaire = :idinventaire
        GROUP BY eanCode
    ) ic
    LEFT JOIN kiabi.inventaire_snapshot snap 
        ON snap.eanCode = ic.eanCode 
       AND snap.idinventaire = :idinventaire
    WHERE snap.eanCode IS NULL
)

ORDER BY eanCode;

    `;

  const result = await sequelize.query(query, {
    replacements: { idinventaire },
    type: sequelize.QueryTypes.SELECT
  });

  return result;
},


async getIntrouvables(idinventaire) {
  if (!idinventaire) throw new Error("⚠️ idinventaire est obligatoire");

  const query = `

SELECT
    c.eanCode,
    c.idinventaire,
    'N/A' AS styleCode,
    'N/A' AS size,
    'N/A' AS color,
    'N/A' AS designation,
    0 AS stock,
    COUNT(c.epc) AS counted_qty,
    NULL AS date_modif,
    1 AS introuvable,
    0 AS inventaire,
    0 AS surplus
FROM kiabi.inventaire_comptage c
LEFT JOIN kiabi.inventaire_snapshot s
    ON c.eanCode = s.eanCode
    AND c.idinventaire = s.idinventaire
WHERE c.idinventaire = :idinventaire
  AND s.styleCode IS NULL
GROUP BY
    c.eanCode,
    c.idinventaire
ORDER BY counted_qty DESC

  `;

  const rows = await sequelize.query(query, {
    replacements: { idinventaire },
    type: sequelize.QueryTypes.SELECT
  });

  return rows;
},

  async createInventaireWithSnapshot(data) {
    const transaction = await sequelize.transaction();
    try {
      // 1️⃣ Créer l'inventaire et récupérer l'ID généré
      const idinventaire = await insertInventaire(data, transaction);

      // 2️⃣ Générer les snapshots pour cet inventaire
      await insertSnapshots(idinventaire, transaction);

      // 3️⃣ Valider la transaction
      await transaction.commit();
      return { idinventaire };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // Liste inventaires
async getAllInventaires() {
  const query = `
    SELECT  
        i.idinventaire,
        i.datedebut,
        i.datefin,
        i.status
    FROM kiabi.inventaire i
    LEFT JOIN (
        SELECT s1.idinventaire, MAX(s1.eanCode) AS snapshot_ean
        FROM inventaire_snapshot s1
        INNER JOIN (
            SELECT idinventaire, MAX(datesnapshot) AS max_date
            FROM inventaire_snapshot
            GROUP BY idinventaire
        ) s2  
          ON s1.idinventaire = s2.idinventaire 
          AND s1.datesnapshot = s2.max_date
        GROUP BY s1.idinventaire
    ) s  
      ON s.idinventaire = i.idinventaire
    GROUP BY i.idinventaire, i.datedebut, i.datefin, i.status
    ORDER BY i.idinventaire DESC;
  `;

  const [result] = await sequelize.query(query);
  return result;
},


  // Détail inventaire simple
  async getInventaireById(id) {
    const query = `SELECT * FROM inventaire WHERE idinventaire = :id`;
    const [result] = await sequelize.query(query, { replacements: { id } });
    return result[0];
  },

  // Ajout de comptages
  async addComptages(idinventaire, items) {
    if (!idinventaire) throw new Error("idinventaire requis");
    const result = [];

    for (const item of items) {
      const existing = await db.InventaireComptage.findOne({
        where: { idinventaire, epc: item.epc },
      });

      if (existing) {
        existing.datemodification = new Date();
        await existing.save();
        result.push(existing);
      } else {
        const newEntry = await db.InventaireComptage.create({
          idinventaire,
          epc: item.epc,
          eanCode: item.eanCode,
          datemodification: new Date(),
        });
        result.push(newEntry);
      }
    }

    return result;
  },

  // Mise à jour inventaire
  async update(id, { datedebut, datefin, status }) {
    const query = `
      UPDATE inventaire
      SET datedebut = :datedebut,
          datefin = :datefin,
          status = :status
      WHERE idinventaire = :id
    `;
    const [result] = await sequelize.query(query, {
      replacements: { id, datedebut, datefin, status },
    });
    return result;
  },

  // Recherche par PK
  async findByPk(id) {
    const query = `
      SELECT * 
      FROM inventaire
      WHERE idinventaire = :id
      LIMIT 1
    `;
    const [rows] = await sequelize.query(query, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });
    return rows || null;
  },

  // Pagination + recherche
async getInventaireDetail({ idinventaire, page = 1, limit = 20, search = "" }) {
  if (!idinventaire) {
    throw new Error("⚠️ idinventaire est obligatoire");
  }

  const offset = (page - 1) * limit;

  // Préparer le filtre de recherche si fourni
  const searchFilter = search
    ? `AND (v.eanCode LIKE :search OR v.styleCode LIKE :search)`
    : "";

  const searchFilterAbsent = search
    ? `AND c.eanCode LIKE :search`
    : "";

  const query = `
    -- 1️⃣ Articles du snapshot avec comptage
    SELECT
        v.eanCode,
        v.idinventaire,
        COALESCE(v.styleCode, 'N/A') AS styleCode,
        COALESCE(v.size, 'N/A') AS size,
        COALESCE(v.color, 'N/A') AS color,
        COALESCE(v.designation, 'N/A') AS designation,
        COALESCE(v.stock, 0) AS stock,
        COUNT(c.epc) AS counted_qty,
        v.dateinventaire AS date_modif,
        CASE WHEN COUNT(c.epc) = 0 THEN 1 ELSE 0 END AS introuvable,
        v.inventaire,
        v.surplus
    FROM v_inventaire v
    LEFT JOIN inventaire_comptage c
        ON c.eanCode = v.eanCode
        AND c.idinventaire = v.idinventaire
    WHERE v.idinventaire = :idinventaire
      ${searchFilter}
    GROUP BY
        v.eanCode,
        v.idinventaire,
        v.styleCode,
        v.size,
        v.color,
        v.designation,
        v.stock,
        v.inventaire,
        v.surplus,
        v.dateinventaire

    UNION ALL

    -- 2️⃣ Articles comptés mais absents du snapshot
    SELECT
        c.eanCode,
        c.idinventaire,
        'N/A' AS styleCode,
        'N/A' AS size,
        'N/A' AS color,
        'N/A' AS designation,
        0 AS stock,
        COUNT(c.epc) AS counted_qty,
        NULL AS date_modif,
        1 AS introuvable,
        0 AS inventaire,
        0 AS surplus
    FROM inventaire_comptage c
    LEFT JOIN inventaire_snapshot s
        ON c.eanCode = s.eanCode
        AND c.idinventaire = s.idinventaire
    WHERE c.idinventaire = :idinventaire
      AND s.styleCode IS NULL
      ${searchFilterAbsent}
    GROUP BY
        c.eanCode,
        c.idinventaire

    ORDER BY counted_qty DESC
    LIMIT :limit OFFSET :offset
  `;

  const result = await sequelize.query(query, {
    replacements: { 
      idinventaire, 
      search: `%${search}%`, 
      limit, 
      offset 
    },
    type: sequelize.QueryTypes.SELECT
  });

  return result;
},

  // Export Excel
  async exportInventaireDetail(idinventaire, search = "") {
    const query = `
      SELECT *
      FROM (
        SELECT 
          s.eanCode, 
          s.color, 
          s.size, 
          s.styleCode, 
          s.designation, 
          s.datesnapshot, 
          s.stock,
          c.count, 
          c.datemodif,
          ROW_NUMBER() OVER (PARTITION BY s.eanCode ORDER BY s.datesnapshot DESC) AS rn
        FROM inventaire_snapshot s
        LEFT JOIN (
          SELECT eanCode, COUNT(id) AS count, MAX(datemodification) AS datemodif
          FROM inventaire_comptage
          GROUP BY eanCode
        ) c ON c.eanCode = s.eanCode
        WHERE s.idinventaire = :idinventaire
        ${
          search
            ? "AND (s.eanCode LIKE :search OR s.styleCode LIKE :search)"
            : ""
        }
      ) t
      WHERE t.rn = 1
      ORDER BY t.datesnapshot DESC
    `;

    const [result] = await sequelize.query(query, {
      replacements: { idinventaire, search: `%${search}%` },
    });

    return result;
  },



  async getInventaireCountOnly({ idinventaire }) {
    const query = `
      SELECT *
      FROM (
        SELECT 
          s.eanCode, 
          s.stock, 
          c.count, 
          c.datemodif,
          ROW_NUMBER() OVER (PARTITION BY s.eanCode ORDER BY s.datesnapshot DESC) as rn
        FROM inventaire_snapshot s
        LEFT JOIN (
          SELECT eanCode, COUNT(id) AS count, MAX(datemodification) AS datemodif
          FROM inventaire_comptage
          GROUP BY eanCode
        ) c ON c.eanCode = s.eanCode
        WHERE s.idinventaire = :idinventaire
      ) t
      WHERE t.rn = 1
    `;

    const [result] = await sequelize.query(query, {
      replacements: { idinventaire },
    });

    return result;
  },

  async deleteInventaire(idinventaire) {
    const query = `DELETE FROM inventaire WHERE idinventaire = :idinventaire`;
    return sequelize.query(query, { replacements: { idinventaire } });
  },
};/**
 * Fonctions internes hors module.exports
 */
const insertInventaire = async (data, transaction) => {
  const query = `
    INSERT INTO inventaire (datedebut, datefin, status)
    VALUES (:datedebut, :datefin, :status)
  `;
  const [result] = await sequelize.query(query, {
    replacements: data,
    transaction,
  });
  return result.insertId || result;
};

const insertSnapshots = async (idinventaire, transaction) => {
  const query = `
    INSERT INTO inventaire_snapshot 
      (idinventaire, eanCode, stock, color, size, styleCode, designation)
    SELECT :idinventaire, eanCode, stock, colorBasicDescription, sizeDescription, styleCode, productTypeDescription
    FROM v_stock `;
  await sequelize.query(query, { replacements: { idinventaire }, transaction });
};

