const dbConfig = require("../config/environments/mysql/db.config");
const Sequelize = require("sequelize");

function getConnexion(){
    return new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: 0,
        port: dbConfig.PORT,
        timezone: '+03:00', // your timezone comes here, ex.: 'US/Hawaii'
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,   
            evict: dbConfig.pool.evict
        },
        logging: false,
    });
}

module.exports = {getConnexion}