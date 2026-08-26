import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext } from "react";
import * as io from "socket.io-client";

// const [userName, setUserName] = useState("");
// const UserContext = createContext({} as ReturnType<any>);

let sk: io.Socket<DefaultEventsMap, DefaultEventsMap>;
const SocketContext = createContext(sk);

// const UserProvider = ({ children }: any) => {
//   return (
//     <UserContext.Provider value={{ userName, setUserName }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

if (import.meta.env.DEV) {
  sk = io.connect("http://localhost:3001");
} else {
  sk = io.connect("https://capstone-gameserver.onrender.com");
}

sk.on("connect", () => console.log("connected to socket"));

const SocketProvider = ({ children }: any) => {
  return <SocketContext.Provider value={sk}>{children}</SocketContext.Provider>;
};

export { SocketContext, SocketProvider };
