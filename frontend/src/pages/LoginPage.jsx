import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider
} from "@mui/material";

export default function Dashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Veuillez vous connecter.");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/prescriptions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrescriptions(res.data);
        if (res.data && res.data.user && res.data.user.role) {
          localStorage.setItem("role", res.data.user.role);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Accès non autorisé. Veuillez vous connecter.");
        } else {
          setError("Erreur lors du chargement des prescriptions.");
        }
        console.error("Erreur lors du chargement :", err);
      }
    };
    fetchPrescriptions();
  }, []);

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  const role = localStorage.getItem("role");
  if (!role) {
    return <Typography variant="h6">Veuillez vous connecter.</Typography>;
  }
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={3}>
        {prescriptions.map((p) => (
          <Grid item xs={12} md={6} lg={4} key={p._id}>
            <Card>
              <CardHeader title={p.patientName} subheader={`Statut: ${p.status}`} />
              <Divider />
              <CardContent>
                <Typography>💊 Médicament: {p.medication}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Blockchain Ref: {p.blockchainRef}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}