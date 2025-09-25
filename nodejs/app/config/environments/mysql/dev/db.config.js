
// Dev
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Admin*25",
    DB: "kiabi",  ///  base de données pour startKit(à changer)
    dialect: "mysql",
    PORT: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
