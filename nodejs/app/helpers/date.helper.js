const dayjs = require("dayjs");
const { formatDate } = require("./helpers.helper");

function formatDateSql(date, format = "YYYY-MM-DD HH:mm:ss"){
    return dayjs(date).format(format);
}

function msToTime(s) {
    if(!s)  return "0"
    // Pad to 2 or 3 digits, default is 2
    function pad(n) {
      return (n + '').padStart(2, "0");
    }
    var j = 0;
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    if(hrs>=24){
      j = Math.floor(hrs/24)
      hrs = hrs % 24;
    } 
    let rep = pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
    if(j >0)
      rep = j + " jour(s) " + rep;
    return rep;
}

function getDaysBetweenDates(date1, date2) {
  // Créer des objets Date
  const startDate = new Date(date1);
  const endDate = new Date(date2);
  
  // Calculer la différence en millisecondes
  const differenceInTime = endDate.getTime() - startDate.getTime();
  
  // Convertir la différence en jours
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
  return differenceInDays;
}

function getFormatedDateArrayFromMonth(month, year, format = "YYYY-MM-DD"){
  const startDate = new Date(year, month - 1, 1);
  const resp = [];
  while(startDate.getMonth() === month -1){
    resp.push(formatDate(startDate, format));
    startDate.setDate(startDate.getDate() + 1);
  }
  return resp;
}

function formatDateToDayName(date){
  const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
  return dayName;
}

module.exports = {
    formatDateSql,
    msToTime,
    getDaysBetweenDates,
    getFormatedDateArrayFromMonth,
    formatDateToDayName
}
