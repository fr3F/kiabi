module.exports = {
    HOST: "192.168.88.250",
    USER: "root",
    PASSWORD: "",
    // DB: "gestion_caisse_dev",
    DB: "kiabi1",
    dialect: "mysql",
    PORT: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
