import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Box
} from "@mui/material";
import API from "../services/api";

export default function EditPrescription() {
  const { id } = useParams();
  const [form, setForm] = useState({ patientName: "", medication: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescription = async () => {
      const res = await API.get(`/prescriptions`);
      const item = res.data.find(p => p._id === id);
      if (item) setForm(item);
    };
    fetchPrescription();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/prescriptions/${id}`, form);
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Modifier la prescription
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nom du patient"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Médicament"
            value={form.medication}
            onChange={(e) => setForm({ ...form, medication: e.target.value })}
            margin="normal"
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Enregistrer
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
