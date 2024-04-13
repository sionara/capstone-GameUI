import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./components/Login/Login.tsx";
import { Register } from "./components/Register/Register.tsx";
import { Dashboard } from "./components/Dashboard/Dashboard.tsx";
import { Profile } from "./components/Profile/Profile.tsx";
import { History } from "./components/History/History.tsx";
import { Game } from "./components/Game/Game.tsx";
import { Lobby } from "./components/Lobby/Lobby.tsx";
import { SecuredRoute } from "./components/SecuredRoute";
import { Landing } from "./components/Landing";
import { UserContext } from "./context/Context.tsx";
import "./App.css"; //global styling

//ROUTING
// TODO: try with React.Lazy()
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/s",
      element: <SecuredRoute />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "history",
          element: <History />,
        },
        {
          path: "lobby",
          element: <Lobby />,
        },
        {
          path: "game",
          element: <Game />,
        },
      ],
    },
  ],
  { basename: "/" }
);

function App() {
  const [userName, setUserName] = useState("");
  return (
    <>
      <UserContext.Provider value={{ userName, setUserName }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  );
}

export default App;
