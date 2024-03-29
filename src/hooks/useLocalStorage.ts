import { useEffect, useState } from "react"; 

const useLocalStorage = (storageKey:string, fallbackState:boolean) => {
  const [value, setValue] = useState(
    JSON.parse(window.localStorage.getItem(storageKey)) ?? fallbackState
  );

  useEffect(() => {
    window.localStorage.setItem(storageKey, value);
  }, [value, storageKey]);

  return [value, setValue];
};

export default useLocalStorage;