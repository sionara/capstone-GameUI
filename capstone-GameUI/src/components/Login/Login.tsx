import React, { useEffect, useState, useRef } from "react";
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

  //session handler
  const [value, setValue] = useLocalStorage("session_id", false);

  // checking to see if session value is true when user navigates to login
  function checkSession() {
    if (value) {
      navigate("/s/dashboard");
    }
  }

  useEffect(() => {
    if (isSaved) {
      setValue(true);
      navigate("/s/dashboard");
    }
  }, [isSaved]);

  useEffect(() => {
    if (value) {
      setValue(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("======== ", e);
    console.log("email:", email, "Password:", password);

    authenticateUser({ email, password });
  };
  return (
    <>
      {/* check session value exists in localstorage */}

      {checkSession()}
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
      <Button variant="contained" onClick={() => navigate("register")}>
        Not Registered? Click here to register
      </Button>
    </>
  );
};
