import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { History } from "./components/History";
import { Game } from "./components/Game";
import { Lobby } from "./components/Lobby/lobby";
import "./App.css";
import { SecuredRoute } from "./components/SecuredRoute/SecuredRoute";

//ROUTING
const router = createBrowserRouter([
  {
    path: "/",
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
