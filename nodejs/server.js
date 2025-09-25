const express = require("express");
const cors = require("cors");
const http = require("http");
const db = require("./app/models");
const setupSocket = require("./socket/socket"); // <-- notre nouveau fichier socket

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8104;

global.__basedir = __dirname;

// CORS
const corsOptions = {
  origin: [
    "http://localhost:8105",
    "http://192.168.88.250:8105",
    "http://192.168.88.250:4200",
    "http://localhost:4200",
    "http://192.168.2.108"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.static(__dirname + "/assets/uploads/"));

// --- SOCKET ---
setupSocket(server, corsOptions);

// Routes
require("./app/routes")(app);

// Synchronisation DB
db.sequelize.sync({ alter: false })
  .then(() => console.log("DB sync OK"))
  .catch(err => console.log("DB sync error:", err));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
