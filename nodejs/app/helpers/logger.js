const winston = require('winston');
const { format } = require('winston');
const { combine, timestamp, printf } = format;
const { format: dateFnsFormat, parseISO } = require('date-fns');
const fs = require('fs');
const path = require('path');
const DailyRotateFile  = require('winston-daily-rotate-file');

// Fonction pour créer un logger avec les paramètres spécifiques
function createLogger(directory, filename) {
  const logDirectory = `logs/${directory}`;
  
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  const transport = new DailyRotateFile({
    filename: path.join(logDirectory, `${filename}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  });

  return winston.createLogger({
    level: 'info',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS', alias: 'logTimestamp' }),
      printf(({ level, message, logTimestamp }) => {
        return `${dateFnsFormat(parseISO(logTimestamp), 'yyyy-MM-dd HH:mm:ss.SSS')} [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [transport]
  });
}

// Création des loggers spécifiques
const loggerEncaissement = createLogger('encaissements', 'encaissement');
const loggerSynchro = createLogger('synchros', 'synchro');
const loggerGifi = createLogger('flux-gifis', 'flux-gifi');
const loggerFiles = createLogger('files', 'files');
const loggerGlobal = createLogger('global', 'gestion-caisse');
const loggerHttp = createLogger('http', 'http');
const loggerError = createLogger('error', 'error');

// Ajout d'un transport Console uniquement pour le loggerEncaissement
// loggerEncaissement.add(new winston.transports.Console());

module.exports = {
  loggerEncaissement,
  loggerSynchro,
  loggerGifi,
  loggerFiles,
  loggerGlobal,
  loggerHttp,
  loggerError
};
