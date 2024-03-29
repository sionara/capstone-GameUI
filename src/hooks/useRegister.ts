import { useState } from "react";

interface RegisterProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const useRegister = () => {
  const [isSaved, setIsSaved] = useState(false);
  
  const register = ({name, email, password, confirmPassword }: RegisterProps) => {
    // this could be path to my database, or external API etc
    console.log(JSON.stringify({name, email, password, confirmPassword}));

    const url = "http://localhost:4000/register";
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, password, confirmPassword}) 
    }
    try {
      // async call
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setIsSaved(true);
        });
    } catch(err) {
      console.log(err);
    }
  }

  return { isSaved, register }
}

export default useRegister;