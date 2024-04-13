import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useRegister from "../../hooks/useRegister";
import { useLocalStorage } from "usehooks-ts";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //@ts-ignore
  const [session, setSession] = useLocalStorage("session", false);

  //for useRegister
  const { isSuccess, register, errorMsg } = useRegister();

  // for routing to api
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
    } else {
      register({
        name,
        email,
        password,
        confirmPassword,
      });
    }
  };

  // navigate to dashboard if isSaved status changes
  useEffect(() => {
    if (isSuccess) {
      setSession(true);
      navigate("/s/dashboard");
    }
  }, [isSuccess]);

  return (
    <>
      <h1>REGISTER</h1>
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
      >
        <div>
          <TextField
            required
            id="outlined-required"
            label="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <TextField
            required
            id="outlined-required"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <TextField
            required
            id="outlined-required"
            label="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <TextField
            required
            id="outlined-required"
            label="Confirm Password"
            value={confirmPassword}
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <p>{errorMsg}</p>

        <Button variant="contained" onClick={handleSubmit}>
          Register
        </Button>
      </Box>

      <Button
        sx={{ mt: "1em" }}
        variant="contained"
        onClick={() => {
          navigate("/");
        }}
      >
        Go Back to Home
      </Button>
    </>
  );
};
