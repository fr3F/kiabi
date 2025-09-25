const fs = require("fs");
const mysql = require("mysql2/promise");
const path = require("path");

const config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "kiabi1", // ⚠️ la base doit exister
};

const sqlDir = path.resolve("E:/Projet/any ampesana/kiabi/bdd");

async function importSQL() {
  try {
    if (!fs.existsSync(sqlDir)) {
      throw new Error(`Dossier introuvable : ${sqlDir}`);
    }

    const files = fs.readdirSync(sqlDir)
      .filter(f => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      throw new Error("Aucun fichier .sql trouvé dans le dossier");
    }

    const connection = await mysql.createConnection(config);
    console.log("✅ Connecté à MySQL");
    console.log(`📂 ${files.length} fichiers trouvés`);

    for (const file of files) {
      const filePath = path.join(sqlDir, file);
      console.log(`➡️ Import de ${file} ...`);

      let sql = fs.readFileSync(filePath, "utf8");

      // ⚡ Corriger collation
      sql = sql.replace(/utf8mb4_0900_ai_ci/gi, "utf8mb4_general_ci");

      // ⚡ Réduire VARCHAR trop longs pour les index
      sql = sql.replace(/varchar\(255\)/gi, "varchar(191)");

      // ⚡ Découper en requêtes
      const queries = sql
        .split(/;\s*$/m)
        .map(q => q.trim())
        .filter(q => q.length);

      for (const query of queries) {
        // ⚠️ Ignorer les CREATE VIEW qui provoquent l'erreur
        if (query.toUpperCase().startsWith("CREATE VIEW")) {
          console.log("⚠️ Vue ignorée :", query.split("\n")[0]);
          continue;
        }

        try {
          await connection.query(query);
        } catch (err) {
          console.log(`⚠️ Requête ignorée ou erreur : ${err.message}`);
        }
      }

      console.log(`✅ ${file} importé`);
    }

    await connection.end();
    console.log("🎉 Import terminé avec relations !");
  } catch (err) {
    console.error("❌ Erreur import :", err.message);
  }
}

importSQL();
