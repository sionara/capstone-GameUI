import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { API_BASE_URL } from "../utils/apiBase";
import { TOKEN_KEY } from "../utils/auth";

interface RegisterProps {
  email: string;
  password: string;
}

const useLogin = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [, setUserName] = useLocalStorage("username", "");
  const [, setUserId] = useLocalStorage("userId", "");
  const [, setUserEmail] = useLocalStorage("userEmail", "");
  // Login token: sent to APIServer and GameServer to prove who this user is.
  const [, setToken] = useLocalStorage(TOKEN_KEY, "");

  const authenticateUser = ({ email, password }: RegisterProps) => {
    const url = `${API_BASE_URL}/login`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
            setUserId(data.id);
            setUserEmail(data.email);
            setToken(data.token);
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
