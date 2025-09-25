// socket.js
const { Server } = require("socket.io");
const inventaireService = require("../app/components/inventaire/services/inventaire.service");
const InventaireSurplusService = require("../app/components/inventaire/services/inventaireSurplus.service");

const service = new InventaireSurplusService();

function setupSocket(server, corsOptions) {
  const io = new Server(server, { cors: corsOptions });

  io.on("connection", (socket) => {
    console.log("Client connecté :", socket.id);

    const roomIntervals = {};

    socket.on("joinInventaire", async (idinventaire) => {
      const id = Number(idinventaire);
      if (isNaN(id)) return console.error("idinventaire invalide :", id);

      const roomName = `inventaire_${id}`;

      // Quitter les autres rooms
      Object.keys(roomIntervals).forEach((room) => {
        socket.leave(room);
        clearInterval(roomIntervals[room]);
        delete roomIntervals[room];
      });

      socket.join(roomName);

      // Envoi initial
      const rows = await inventaireService.getInventaireDetail({ idinventaire: id });
      io.to(roomName).emit("inventaireData", rows);

      const interval = setInterval(async () => {
        try {
          // Introuvables
          const totalAbsent = await service.getIntrouvable(id);
          io.to(roomName).emit("getIntrouvable", { rows: [], total_introvable: totalAbsent });

          // OverStock
          const totalOverStock = await service.surplusTotal(id);
          io.to(roomName).emit("overStockData", { rows: [], total_count: totalOverStock });

          //count
          const totalIntrouvable = await inventaireService.getCountIntrouvable(id);
          io.to(roomName).emit("inventraireIntrouvable", { rows: [], total_introuvable: totalIntrouvable });

          // Count
          const countRows = await inventaireService.getInventaireCountOnly({ idinventaire: id });
          io.to(roomName).emit("inventaireCountUpdate", countRows);

          // Progress
          const progress = await inventaireService.calculerProgressInventaire(id);
          io.to(roomName).emit("inventaireProgressUpdate", progress);
        } catch (err) {
          console.error("Erreur mise à jour en temps réel :", err);
        }
      }, 2000);

      roomIntervals[roomName] = interval;
    });

    socket.on("leaveInventaire", (idinventaire) => {
      const roomName = `inventaire_${idinventaire}`;
      socket.leave(roomName);
      if (roomIntervals[roomName]) {
        clearInterval(roomIntervals[roomName]);
        delete roomIntervals[roomName];
      }
    });

    socket.on("disconnect", () => {
      Object.values(roomIntervals).forEach(clearInterval);
    });
  });

  return io;
}

module.exports = setupSocket;
