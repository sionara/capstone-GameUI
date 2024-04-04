import { useContext } from "react";
import ResponsiveAppBar from "./nav";
import Button from "@mui/material/Button";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { UserContext } from "../../context/Context";

export const Dashboard = () => {
  const navigate = useNavigate();
  //@ts-ignore
  const [session, setSession] = useLocalStorage("session", true);
  const { userName } = useContext(UserContext);
  console.log(userName);

  function enterLobby() {
    navigate("/s/lobby");
  }

  function checkHistory() {
    navigate("/s/history");
  }

  function editProfile() {
    navigate("/s/profile");
  }

  const logOut = () => {
    setSession(false);
    navigate("/");
  };

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
      <Button variant="contained" onClick={logOut}>
        LogOut
      </Button>
      <Outlet />
    </>
  );
};
