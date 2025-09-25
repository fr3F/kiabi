require("dotenv").config();
const cors = require("cors");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const { initSocketRFIDReader } = require("./app/services/rfid/initSocketReader");
const { IPSocket, PortSocket } = require("./app/config/environments/socketUHF/reader");
const { connectMongoDB, checkMongoConnection } = require("./app/config/environments/mongo/db_mongo.config");

const app = express();
app.use(express.json());

const PORT = process.env.SOCKET_PORT || 3001;

const allowedOrigins = [
  "http://localhost:8100",
  "http://192.168.2.41:8100",
  "http://localhost:8105",
  "http://192.168.2.41:8105",
  "http://192.168.2.108"
];

// ✅ Configuration CORS complète
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Origin bloquée :", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// ✅ Middleware CORS global
app.use(cors(corsOptions));

// ✅ Pour les requêtes OPTIONS (préflight)
app.options("*", cors(corsOptions));

// ✅ Créer serveur HTTP + WebSocket
const server = http.createServer(app);

// ✅ Socket.IO avec CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Connexion MongoDB
(async () => {
  try {
    await connectMongoDB();
    checkMongoConnection();
  } catch (err) {
    console.error("Erreur MongoDB:", err);
    process.exit(1);
  }
})();

// ✅ Route de test
app.get("/", (req, res) => {
  res.json({ message: "Welcome to SODIM application RFID." });
});

// ✅ Routes API
require("./app/routes/indexRfid")(app);

// ✅ Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connecté", socket.id);

  socket.on("disconnect", () => {
    console.log("Client déconnecté", socket.id);
  });
});

// ✅ Initialisation lecteur RFID
try {
  initSocketRFIDReader(IPSocket, PortSocket, io);
  console.log("Lecteur RFID initialisé");
} catch (error) {
  console.error("Erreur RFID:", error);
}

// ✅ Démarrage du serveur
server.listen(PORT, () => {
  console.log(`✅ Serveur en écoute : http://localhost:${PORT}`);
});
