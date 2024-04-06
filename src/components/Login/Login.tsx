import React, { useEffect, useState, useRef, useContext } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { useLocalStorage } from "usehooks-ts";
import { UserContext } from "../../context/Context";

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

  const { setUserName } = useContext(UserContext);

  useEffect(() => {
    if (session) {
      setSession(false);
    }
  }, []);

  useEffect(() => {
    if (isSaved) {
      setSession(true);
      setUserName("John");
      navigate("/s/dashboard");
    }
  }, [isSaved]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("======== ", e);
    console.log("email:", email, "Password:", password);

    // if authentication is successful, isSaved will be set to true
    authenticateUser({ email, password });
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
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
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
            required
            id="outlined-required"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
      <Button variant="contained" onClick={() => navigate("/register")}>
        Not Registered? Click here to register
      </Button>
    </>
  );
};
