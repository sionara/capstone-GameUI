import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
interface RegisterProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const useRegister = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  //@ts-ignore
  const [username, setUserName] = useLocalStorage("username", "");
  let url;

  const register = ({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterProps) => {
    console.log(JSON.stringify({ name, email, password, confirmPassword }));
    // if (window.navigator.userAgent.includes("Android"))
    if (import.meta.env.DEV) {
      url = "http://localhost:4000/register";
    } else {
      url = "https://capstone-apiserver.onrender.com/register";
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    };
    try {
      // async call
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          if (data.msg === "success") {
            setIsSuccess(true);
            setUserName(data.name);
          } else {
            setErrorMsg(data.msg);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return { isSuccess, register, errorMsg };
};

export default useRegister;
