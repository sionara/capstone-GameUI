import { Navigate, Outlet } from "react-router-dom";
import { useReadLocalStorage } from "usehooks-ts";
import { HeaderNav } from "./HeaderNav";
import { Typography } from "@mui/material";

// destructuring props
export const SecuredRoute = () => {
  const session = useReadLocalStorage("session");

  // navigate to landing page if session does not exist
  if (!session) {
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
