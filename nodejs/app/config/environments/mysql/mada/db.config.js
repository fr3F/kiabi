module.exports = {
    HOST: "192.168.2.114",
    USER: "root",
    PASSWORD: "Admin*25",
    // DB: "gestion_caisse_dev",
    DB: "kiabi",
    dialect: "mysql",
    PORT: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
