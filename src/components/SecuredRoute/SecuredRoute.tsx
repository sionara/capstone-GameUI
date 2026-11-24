import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useReadLocalStorage } from "usehooks-ts";
import { HeaderNav } from "./HeaderNav";
import { Typography } from "@mui/material";
import { SocketContext } from "../../context/Context";
import { TOKEN_KEY } from "../../utils/auth";

// destructuring props
export const SecuredRoute = () => {
  const session = useReadLocalStorage("session");
  // Logins from before tokens existed have a session flag but no token -
  // they must log in again so the servers can verify them.
  const token = useReadLocalStorage(TOKEN_KEY);
  const socket = useContext(SocketContext);
  const loggedIn = Boolean(session && token);

  // The socket waits for a login token (autoConnect is off in Context.tsx),
  // so connect once we know the user is logged in.
  useEffect(() => {
    if (loggedIn && !socket.connected) {
      socket.connect();
    }
  }, [loggedIn, socket]);

  // navigate to landing page if session does not exist
  if (!loggedIn) {
    return <Navigate to="/"></Navigate>;
  }

  return (
    <>
      <HeaderNav />
      <Outlet />
      <Typography sx={{ mt: 4 }}>© Copyright Sion Lee, 2024</Typography>
    </>
  );
};
