import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useRegister from "../../hooks/useRegister";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //for useRegister
  const { isSaved, register } = useRegister();

  // for routing to api
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register({
      name,
      email,
      password,
      confirmPassword,
    });
  };

  // navigate to dashboard if isSaved status changes
  useEffect(() => {
    if (isSaved) {
      navigate("/s/dashboard");
    }
  }, [isSaved]);

  return (
    <>
      <h1>REGISTER</h1>
      <form onSubmit={handleSubmit}>
        <Box>
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <TextField
              required
              id="outlined-required"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </Box>
        <Button type="submit" variant="contained">
          Register
        </Button>
      </form>
    </>
  );
};
