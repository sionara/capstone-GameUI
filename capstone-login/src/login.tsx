import React, { useState} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // to use the navigate method of react-router-dom
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('======== ', e);
    console.log("email:", email, "Password:", password);
    // navigate('/register');
  }

  return (
    <>
      <h1>LOGIN</h1>
      
        <Box component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
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
              value = {email}
              onChange={(e) => setEmail(e.target.value) }
            />
          </div>
          <div>
            <TextField
              required
              id="outlined-required"
              label="Password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant='contained' >
            Submit
          </Button>
        </Box>  
      <Button variant = 'contained' onClick = {() => navigate("register") } >Not Registered? Click here to register</Button>
    </>
  )
}