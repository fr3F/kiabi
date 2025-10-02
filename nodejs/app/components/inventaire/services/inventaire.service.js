const db = require("../../../models");
const { sequelize } = require("../../../models");

module.exports = {
  
  async calculerProgressInventaire(idinventaire) {
    if (!idinventaire) {
      throw new Error("idinventaire est obligatoire");
    }

    const query = `
      select sum(theorique)/(sum(inventaire) - sum(surplus))*100 as avancement from (
      SELECT snap.stock as theorique, (
      SELECT count(epc) as inventaire FROM inventaire_comptage where idinventaire=:idinventaire and eanCode=snap.eanCode) as inventaire,
      ((SELECT count(epc) as inventaire FROM inventaire_comptage where idinventaire=:idinventaire and eanCode=snap.eanCode) - snap.stock) 	as surplus
      FROM inventaire_snapshot snap 
      left join inventaire i on i.idinventaire = snap.idinventaire
      WHERE i.idinventaire=:idinventaire) as a;
    `;

    const result = await sequelize.query(query, {
      replacements: { idinventaire },
      type: sequelize.QueryTypes.SELECT
    });

    const avancement = Number(result[0]?.avancement || 0);
    return  avancement;
  },

  async getSurplusListes(idinventaire) {
    const query = `
      SELECT *
      FROM v_surplusListes
      WHERE idinventaire = :idinventaire
      ORDER BY eanCode;
    `;
    const result = await sequelize.query(query, {
      replacements: { idinventaire },
      type: sequelize.QueryTypes.SELECT
    });

    return result;
  },

  async getIntrouvablesListes(idinventaire) {
    if (!idinventaire) throw new Error("idinventaire est obligatoire");

    const query = `
      SELECT 
          snap.eanCode,
          snap.styleCode,
          snap.color,
          snap.stock,
          snap.size,
          snap.designation,
          (snap.stock - IFNULL(ic.counted_qty, 0)) AS introuvable,
          IFNULL(ic.counted_qty, 0) AS counted_qty,
          ic.last_modif AS date_modif
      FROM inventaire_snapshot snap
      LEFT JOIN inventaire i 
          ON i.idinventaire = snap.idinventaire
      LEFT JOIN (
          SELECT 
              eanCode,
              idinventaire,
              COUNT(epc) AS counted_qty,
              MAX(datemodification) AS last_modif
          FROM inventaire_comptage
          WHERE idinventaire = :idinventaire
          GROUP BY eanCode, idinventaire
      ) ic
          ON snap.eanCode = ic.eanCode
          AND snap.idinventaire = ic.idinventaire
      WHERE i.idinventaire = :idinventaire
        AND (snap.stock - IFNULL(ic.counted_qty, 0)) > 0
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
      const idinventaire = await this.insertInventaire(data, transaction);

      await this.insertSnapshots(idinventaire, transaction);

      await transaction.commit();
      return { idinventaire };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async getAllInventaires() {
    const query = `
      SELECT  
          i.idinventaire,
          i.datedebut,
          i.datefin,
          i.status
      FROM inventaire i
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

  async updateInventaire(id, { datedebut, datefin, status }) {
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
      throw new Error("idinventaire est obligatoire");
    }
    const offset = (page - 1) * limit;
    const searchFilter = search
      ? `AND (v.eanCode LIKE :search OR v.styleCode LIKE :search)`
      : "";

    const query = `
      SELECT *
      FROM kiabi.v_inventairedetail v
      WHERE v.idinventaire = :idinventaire
        ${searchFilter}
      ORDER BY counted_qty DESC
      LIMIT :limit OFFSET :offset;
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


  async countInventaireDetail({ idinventaire}) {
    if (!idinventaire) {
      throw new Error("idinventaire est obligatoire");
    }

    const query = `
      SELECT COUNT(*) as total
      FROM kiabi.v_inventairedetail v
      WHERE v.idinventaire = :idinventaire;
    `;
    const result = await sequelize.query(query, {
      replacements: {
        idinventaire,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    return result[0].total;
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


  async insertInventaire (data, transaction) {
    const query = `
      INSERT INTO inventaire (datedebut, datefin, status)
      VALUES (:datedebut, :datefin, :status)
    `;
    const [result] = await sequelize.query(query, {
      replacements: data,
      transaction,
    });
    return result.insertId || result;
  },

  async insertSnapshots (idinventaire, transaction) {
    const query = `
      INSERT INTO inventaire_snapshot (idinventaire, eanCode, stock, color, size, styleCode, designation)
      SELECT :idinventaire, eanCode, stock, colorBasicDescription, sizeDescription, styleCode, productTypeDescription
      FROM v_stock `;
    await sequelize.query(query, { replacements: { idinventaire }, transaction });
  }

};

 
