import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { useLocalStorage } from "usehooks-ts";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // to use the navigate method of react-router-dom
  const navigate = useNavigate();
  const { isSuccess, authenticateUser, errMsg } = useLogin();

  // using the useLocalStorage hook to set session in local storage
  const [session, setSession] = useLocalStorage("session", false);
  // checking to see if session value is true when user navigates to login

  useEffect(() => {
    if (session) {
      setSession(false);
    }
  }, []);

  useEffect(() => {
    //setSesion(true) used to bypass login
    if (isSuccess) {
      setSession(true);
      navigate("/s/dashboard");
    }
  }, [isSuccess]);

  const handleSubmit = () => {
    // if authentication is successful, isSaved will be set to true
    if (email === "" || password === "") {
      alert("please enter your email and password");
    } else {
      authenticateUser({ email, password });
    }
  };
  return (
    <>
      <h1>LOGIN</h1>
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
      >
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
            required // need to make this required to prevent empty strings
            id="outlined-required"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </Box>

      <p aria-live="assertive" style={{ color: "red" }}>
        {errMsg}
      </p>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" onClick={() => navigate("/register")}>
          Not Registered? Click here to register
        </Button>
      </Box>
    </>
  );
};
