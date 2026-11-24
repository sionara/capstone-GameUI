import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext } from "react";
import * as io from "socket.io-client";
import { forceLogout, getToken } from "../utils/auth";

// const [userName, setUserName] = useState("");
// const UserContext = createContext({} as ReturnType<any>);

// const UserProvider = ({ children }: any) => {
//   return (
//     <UserContext.Provider value={{ userName, setUserName }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

const GAME_SERVER_URL = import.meta.env.DEV
  ? "http://localhost:3001"
  : "https://capstone-gameserver.onrender.com";

// GameServer only accepts sockets carrying a valid login token, so:
//  - autoConnect is off: there's no token before login. SecuredRoute calls
//    connect() once the user is logged in; Login disconnects on logout.
//  - auth is a function, so every connect/reconnect reads the current token
//    rather than whatever was stored when this module first loaded.
const sk: io.Socket<DefaultEventsMap, DefaultEventsMap> = io.connect(
  GAME_SERVER_URL,
  {
    autoConnect: false,
    auth: (cb) => cb({ token: getToken() }),
  }
);

const SocketContext = createContext(sk);

sk.on("connect", () => console.log("connected to socket"));

// GameServer rejected the token (expired/invalid). Network failures also
// raise connect_error but with a different message - those just retry.
sk.on("connect_error", (err) => {
  if (err.message === "unauthorized") {
    sk.disconnect();
    forceLogout();
  }
});

const SocketProvider = ({ children }: any) => {
  return <SocketContext.Provider value={sk}>{children}</SocketContext.Provider>;
};

export { SocketContext, SocketProvider };
