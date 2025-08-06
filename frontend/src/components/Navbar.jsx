import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/");
};

  {role === "hospital" && (
  <Button color="inherit" onClick={() => navigate("/create")}>Créer</Button>
)}


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MediPlatform
        </Typography>
        <Button color="inherit" onClick={() => navigate("/dashboard")}>Dashboard</Button>
        <Button color="inherit" onClick={() => navigate("/create")}>Créer</Button>
        <Button color="inherit" onClick={logout}>Déconnexion</Button>
      </Toolbar>
    </AppBar>
  );
}