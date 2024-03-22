import React from "react";
import ResponsiveAppBar from "./nav";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  function enterLobby() {
    navigate("/lobby");
  }

  function checkHistory() {
    navigate("/dashboard/history");
  }

  function editProfile() {
    navigate("/dashboard/profile");
  }

  return (
    <>
      <header>
        <ResponsiveAppBar />
      </header>
      <h1>This is the dashboard</h1>

      <Button variant="contained" onClick={enterLobby}>
        Enter Lobby
      </Button>
      <Button variant="contained" onClick={checkHistory}>
        Check my history
      </Button>
      <Button variant="contained" onClick={editProfile}>
        Edit my profile
      </Button>
    </>
  );
};
