import { Navigate, Outlet } from "react-router-dom";
import { useReadLocalStorage } from "usehooks-ts";

// destructuring props
export const SecuredRoute = () => {
  const session = useReadLocalStorage("session");

  // navigate to landing page if session does not exist
  if (!session) {
    return <Navigate to="/"></Navigate>;
  }

  return (
    <>
      <h1>Welcome</h1>
      <Outlet />
    </>
  );
};
