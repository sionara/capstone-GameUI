import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { useLocalStorage } from "usehooks-ts";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const errRef = useRef(null);
  const [errMsg] = useState();

  // to use the navigate method of react-router-dom
  const navigate = useNavigate();
  const { isSaved, authenticateUser } = useLogin();

  // using the useLocalStorage hook to set session in local storage
  const [session, setSession] = useLocalStorage("session", false);
  // checking to see if session value is true when user navigates to login

  useEffect(() => {
    if (session) {
      setSession(false);
    }
  }, []);

  useEffect(() => {
    if (isSaved) {
      // setSession(true); this is used to bypass server authorization
      setSession(true);
      navigate("/s/dashboard");
    }
  }, [isSaved]);

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
      <p
        ref={errRef}
        className={errMsg ? "showMsg" : "hideMsg"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
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
