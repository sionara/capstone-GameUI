import { Outlet } from "react-router-dom";

export const SecuredRoute = () => {
  return (
    <>
      <h1>Welcome</h1>
      <Outlet />
    </>
  );
};
