const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["hospital", "pharmacy", "delivery", "patient"] }
});

module.exports = mongoose.model("User", userSchema);

// backend/models/Prescription.js
const { Schema, model } = require("mongoose");

const prescriptionSchema = new Schema({
  patientName: String,
  medication: String,
  status: { type: String, enum: ["prescribed", "validated", "delivered"], default: "prescribed" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  blockchainRef: String
}, { timestamps: true });

module.exports = model("Prescription", prescriptionSchema);
