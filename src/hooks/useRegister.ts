import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
interface RegisterProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const useRegister = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [username, setUserName] = useLocalStorage("username", "");
  let url;

  const register = ({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterProps) => {
    console.log(JSON.stringify({ name, email, password, confirmPassword }));
    if (window.navigator.userAgent.includes("android")) {
      url = "https://48fa-67-71-196-232.ngrok-free.app/register";
    } else {
      url = "http://localhost:4000/register";
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    };
    try {
      // async call
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          setIsSaved(true);
          setUserName(data.name);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return { isSaved, register };
};

export default useRegister;
