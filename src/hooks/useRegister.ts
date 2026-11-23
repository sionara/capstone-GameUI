import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { API_BASE_URL } from "../utils/apiBase";

interface RegisterProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const useRegister = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [, setUserName] = useLocalStorage("username", "");
  const [, setUserId] = useLocalStorage("userId", "");
  const [, setUserEmail] = useLocalStorage("userEmail", "");

  const register = ({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterProps) => {
    const url = `${API_BASE_URL}/register`;

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
            setUserId(data.id);
            setUserEmail(data.email);
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
