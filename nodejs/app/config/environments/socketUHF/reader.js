require('dotenv').config();

module.exports = {
  IPSocket: process.env.UHF_SOCKET_IP || '127.0.0.1',
  PortSocket: process.env.UHF_SOCKET_PORT || '4000',
};
