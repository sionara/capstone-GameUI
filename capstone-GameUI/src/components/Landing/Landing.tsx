import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  const redirectToRegister = () => {
    navigate("/register");
  };

  const redirectToLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <h1>Online Rock-Paper Scissor</h1>

      <p>
        Welcome to Online Rock-Paper-Scissor! Register now to play and become
        the best rock paper scissor player!
      </p>

      <Button variant="contained" onClick={redirectToRegister}>
        Register
      </Button>
      <Button variant="contained" onClick={redirectToLogin}>
        Login
      </Button>
    </>
  );
};
