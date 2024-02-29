import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  function handleSubmit() {
    console.log(name, email, password, confirmPassword);
  }
  return(
    <>
      <h1>REGISTER</h1>
      <form onSubmit={handleSubmit}>
        <Box>
          <div>
              <TextField
                required
                id="outlined-required"
                label="name"
                defaultValue="email@email.com"
                value = {name}
                onChange={(e) => setName(e.target.value) }
              />
            </div>
            <div>
              <TextField
                required
                id="outlined-required"
                label="Email"
                defaultValue="email@email.com"
                value = {email}
                onChange={(e) => setEmail(e.target.value) }
              />
            </div>
            <div>
              <TextField
                required
                id="outlined-required"
                label="Password"
                defaultValue="email@email.com"
                value = {password}
                onChange={(e) => setPassword(e.target.value) }
              />
            </div>
            <div>
              <TextField
                required
                id="outlined-required"
                label="Confirm Password"
                defaultValue="email@email.com"
                value = {confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value) }
              />
            </div>
        </Box>
        <Button type="submit" variant='contained' >Register</Button>
      </form>

    </>
  )
}