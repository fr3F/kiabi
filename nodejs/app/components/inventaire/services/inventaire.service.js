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
SELECT
    snap.eanCode,
    snap.color,
    snap.designation,
    snap.styleCode,
    snap.size,
    snap.stock,
    c.count_epc AS counted_qty,
    (c.count_epc - snap.stock) AS difference,
    c.last_modif AS date_modif,
    'introuvable' AS type
FROM kiabi.inventaire_snapshot snap
JOIN (
    SELECT 
        eanCode,
        idinventaire,
        COUNT(*) AS count_epc,
        MAX(datemodification) AS last_modif
    FROM kiabi.inventaire_comptage
    WHERE idinventaire = :idinventaire
    GROUP BY eanCode, idinventaire
) c ON c.eanCode = snap.eanCode AND c.idinventaire = snap.idinventaire
WHERE snap.idinventaire = :idinventaire
  AND (c.count_epc - snap.stock) > 0

UNION ALL

SELECT 
    ic.eanCode,
    NULL AS color,
    s.designation,
    s.styleCode,
    s.size,
    s.stock,
    COUNT(ic.epc) AS counted_qty,
    COUNT(ic.epc) AS difference,
    MAX(ic.datemodification) AS date_modif,
    'nonexistant' AS type
FROM inventaire_comptage ic
LEFT JOIN inventaire_snapshot s
    ON ic.eanCode = s.eanCode AND s.idinventaire = :idinventaire
WHERE ic.idinventaire = :idinventaire
  AND s.eanCode IS NULL
GROUP BY ic.eanCode, s.styleCode, s.designation, s.size, s.stock
ORDER BY eanCode
LIMIT 0, 1000;

    `;

  const result = await sequelize.query(query, {
    replacements: { idinventaire },
    type: sequelize.QueryTypes.SELECT
  });

  return result;
},

// async getIntrouvables(idinventaire) {
//   if (!idinventaire) throw new Error("⚠️ idinventaire est obligatoire");

//   const query = `

//     SELECT 
//     ic.eanCode, 
//     s.styleCode,
//     s.stock,
//     s.size,
//     s.designation,
//     max(ic.datemodification) as date_modif,
//         COUNT(ic.epc)  as counted_qty,
//     COUNT(ic.epc) AS surplusnonexistant
// FROM inventaire_comptage ic
// LEFT JOIN inventaire_snapshot s
//     ON ic.eanCode = s.eanCode AND s.idinventaire = :idinventaire
// WHERE ic.idinventaire = :idinventaire
//   AND s.eanCode IS NULL  
// GROUP BY ic.eanCode, s.styleCode
// LIMIT 0, 1000;

//   `;

//   const rows = await sequelize.query(query, {
//     replacements: { idinventaire },
//     type: sequelize.QueryTypes.SELECT
//   });

//   return rows;
// },


async getIntrouvables(idinventaire) {
  if (!idinventaire) throw new Error("⚠️ idinventaire est obligatoire");

  const query = `
    SELECT *
    FROM (
        SELECT 
            (c.count_epc - snap.stock) AS introuvable,
            snap.eanCode,
            snap.color,
            snap.size,
            snap.styleCode,
            snap.designation,
            snap.stock,
            c.count_epc AS counted_qty,
            c.last_modif AS date_modif
        FROM kiabi.inventaire_snapshot snap
        LEFT JOIN kiabi.inventaire i 
            ON i.idinventaire = snap.idinventaire
        LEFT JOIN (
            SELECT 
                eanCode,
                idinventaire,
                COUNT(*) AS count_epc,
                MAX(datemodification) AS last_modif
            FROM kiabi.inventaire_comptage
            WHERE idinventaire = :idinventaire
            GROUP BY eanCode, idinventaire
        ) c ON c.eanCode = snap.eanCode AND c.idinventaire = snap.idinventaire
        WHERE i.idinventaire = :idinventaire
          AND c.count_epc > 0
    ) AS b
    WHERE introuvable > 0;

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
    SELECT 
      s.eanCode, 
      s.color, 
      s.size, 
      s.styleCode, 
      s.designation, 
      s.datesnapshot, 
      s.stock,
      c.count, 
      c.datemodif
    FROM inventaire_snapshot s
    LEFT JOIN (
      SELECT eanCode, COUNT(id) AS count, MAX(datemodification) AS datemodif
      FROM inventaire_comptage
      GROUP BY eanCode
    ) c ON c.eanCode = s.eanCode
    WHERE s.idinventaire = :idinventaire
      AND s.datesnapshot = (
        SELECT MAX(datesnapshot)
        FROM inventaire_snapshot
        WHERE eanCode = s.eanCode
          AND idinventaire = :idinventaire
      )
      ${search ? "AND (s.eanCode LIKE :search OR s.styleCode LIKE :search)" : ""}
    ORDER BY s.datesnapshot DESC
  `;

  const [result] = await sequelize.query(query, {
    replacements: { idinventaire, search: `%${search}%` },
  });

  return result;
},



async getInventaireCountOnly({ idinventaire }) {
  const query = `
    SELECT 
      s.eanCode, 
      s.stock, 
      c.count, 
      c.datemodif
    FROM inventaire_snapshot s
    LEFT JOIN (
      SELECT eanCode, COUNT(id) AS count, MAX(datemodification) AS datemodif
      FROM inventaire_comptage
      GROUP BY eanCode
    ) c ON c.eanCode = s.eanCode
    WHERE s.idinventaire = :idinventaire
      AND s.datesnapshot = (
        SELECT MAX(datesnapshot)
        FROM inventaire_snapshot
        WHERE eanCode = s.eanCode
          AND idinventaire = :idinventaire
      )
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

