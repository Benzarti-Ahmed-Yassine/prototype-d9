const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getPrescriptions,
  updatePrescription,
  deletePrescription
} = require("../controllers/prescriptionController");
const { verifyToken } = require("../services/authMiddleware");

router.post("/", verifyToken, createPrescription);
router.get("/", verifyToken, getPrescriptions);
router.put("/:id", verifyToken, updatePrescription);
router.delete("/:id", verifyToken, deletePrescription);

module.exports = router;
