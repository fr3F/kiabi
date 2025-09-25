var cron = require('node-cron');
const { updateAllDataFromFtpSync } = require('../components/data-transfert/services/data.service');
const { loggerGlobal } = require('../helpers/logger');
const { sendSalesToFtp } = require('../components/sales/services/file.service');
const { sendClientFileSync } = require('../services/gifi/client-vip/file.service');
const { sendLoyactFileSync } = require('../components/others/marketing/loyact/services/file.service');
// const { updateDeviseMadaHTML } = require('../components/crons/update-devise/devise-mada-html.service');
// Option timezone cron
const option = {
    scheduled: true,
    timezone: "Africa/Addis_Ababa"
}

// cron.schedule('0 * * * *', ()=>{
//     loggerGlobal.info("Cron pour update data FTP")
//     updateAllDataFromFtpSync();
// });


cron.schedule('0 22 * * *', ()=>{
    sendClientFileSync();
});

cron.schedule('0 22 * * *', ()=>{
    sendLoyactFileSync();
});

// cron.schedule('* * * * *', async ()=>{
cron.schedule('0 21 * * *', async ()=>{
    try{
        loggerGlobal.info("Cron send SALES - démarré");
        await sendSalesToFtp(new Date())
        loggerGlobal.info("Cron send SALES - terminé");
    }
    catch(err){
        loggerGlobal.error("Cron send SALES");
        loggerGlobal.error(err.stack);
    }
});
