import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
interface RegisterProps {
  email: string;
  password: string;
}

const useLogin = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [username, setUserName] = useLocalStorage("username", "");
  let url;

  const authenticateUser = ({ email, password }: RegisterProps) => {
    // this could be path to my database, or external API etc
    if (window.navigator.userAgent.includes("Android")) {
      url = "https://36cb-67-71-196-232.ngrok-free.app/login";
    } else {
      url = "http://localhost:4000/login";
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
          setIsSaved(true);
          setUserName(data.name);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return { isSaved, authenticateUser };
};

export default useLogin;
