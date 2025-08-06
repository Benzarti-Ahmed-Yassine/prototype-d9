const express = require("express");
const { sequelize } = require("./models/Prescription");
const authRoutes = require("./routes/authRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const hederaService = require("./hedera/hederaService");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Synchronisation de la base SQLite
sequelize.sync()
  .then(() => console.log("SQLite connecté et synchronisé"))
  .catch((err) => console.error("Erreur SQLite:", err));

app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

app.get("/api/health", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur backend sur le port ${PORT}`));