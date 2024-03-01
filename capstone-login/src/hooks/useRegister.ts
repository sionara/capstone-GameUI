import React, { useState } from "react";

const UseRegister = () => {
  const [isSaved, setIsSaved] = useState(false);
  
  const register = () => {
    // this could be path to my database, or external API etc
    const url = "https://jsonplaceholder.typicode.com/todos"; //dummy api

    try {
      // async call
      fetch(url)
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

export default UseRegister;