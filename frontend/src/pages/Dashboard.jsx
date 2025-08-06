import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();
  // Ajout d'une variable role par défaut (à adapter selon ton app)
  const role = "hospital"; // ou "doctor", "patient", etc.

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get("/prescriptions");
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette prescription ?")) {
      await API.delete(`/prescriptions/${id}`);
      fetchPrescriptions();
    }
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tableau de bord
        </Typography>
        {role === "hospital" && (
          <Button variant="contained" onClick={() => navigate("/create")} sx={{ mb: 3 }}>
            + Nouvelle prescription
          </Button>
        )}
        <Grid container spacing={3}>
          {prescriptions.map((p) => (
            <Grid item xs={12} md={6} lg={4} key={p._id}>
              <Card>
                <CardHeader title={p.patientName} subheader={`Statut: ${p.status}`} />
                <Divider />
                <CardContent>
                  <Typography>Médicament: {p.medication}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Blockchain Ref: {p.blockchainRef}
                  </Typography>
                  {role === "hospital" && (
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button size="small" variant="outlined" onClick={() => navigate(`/edit/${p._id}`)}>
                        Modifier
                      </Button>
                      <Button size="small" color="error" variant="contained" onClick={() => handleDelete(p._id)}>
                        Supprimer
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
