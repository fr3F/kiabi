const prestashopAPI = require('@kasual-business/prestashop-api');
const { PRESTASHOP_CONFIG } = require('../../../../../config/environments/mysql/environment');

prestashopAPI.init(PRESTASHOP_CONFIG.url, PRESTASHOP_CONFIG.key);


module.exports = {
    prestashopAPI
}