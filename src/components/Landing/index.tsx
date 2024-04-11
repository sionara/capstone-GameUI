import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReadLocalStorage } from "usehooks-ts";

export const Landing = () => {
  const navigate = useNavigate();
  const username = useReadLocalStorage("username");

  const redirectToRegister = () => {
    navigate("/register");
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  // useEffect(() => {
  //   if (username) {
  //     navigate("/s/dashboard");
  //   }
  // }, [username]);
  return (
    <>
      <h1>Online Rock-Paper Scissor</h1>

      <p>
        Welcome to Online Rock-Paper-Scissor! Register now to play and become
        the best rock paper scissor player!
      </p>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
        <Button variant="contained" onClick={redirectToRegister}>
          Register
        </Button>
        <Button variant="contained" onClick={redirectToLogin}>
          Login
        </Button>
      </Box>
    </>
  );
};
