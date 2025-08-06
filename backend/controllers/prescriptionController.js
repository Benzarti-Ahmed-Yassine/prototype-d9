// backend/controllers/prescriptionController.js
const { Prescription } = require("../models/Prescription");
const { logPrescriptionOnChain } = require("../hedera/hederaService");

exports.createPrescription = async (req, res) => {
  try {
    const { patientName, medication } = req.body;
    const blockchainRef = await logPrescriptionOnChain({ patientName, medication });
    const prescription = await Prescription.create({
      ...req.body,
      blockchainRef,
      createdBy: req.user ? req.user.id : null
    });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRows] = await Prescription.update(req.body, { where: { id } });
    if (!updatedRows) return res.status(404).json({ message: "Prescription introuvable" });
    const updated = await Prescription.findByPk(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Prescription.destroy({ where: { id } });
    if (!deletedRows) return res.status(404).json({ message: "Prescription introuvable" });
    res.json({ message: "Prescription supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
