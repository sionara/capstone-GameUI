import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
interface RegisterProps {
  email: string;
  password: string;
}

const useLogin = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  //@ts-ignore
  const [username, setUserName] = useLocalStorage("username", "");
  let url;

  const authenticateUser = ({ email, password }: RegisterProps) => {
    // this could be path to my database, or external API etc
    if (import.meta.env.DEV) {
      url = "http://localhost:4000/login";
    } else {
      url = "https://capstone-apiserver.onrender.com/login";
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };
    try {
      // async call
      // on succes, we want server to send us the user's name
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.msg === "success") {
            setIsSuccess(true);
            setUserName(data.name);
          } else {
            setErrMsg(data.msg);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return { isSuccess, authenticateUser, errMsg };
};

export default useLogin;
