import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { History } from "./components/History";
import { Game } from "./components/Game";
import { Lobby } from "./components/Lobby/lobby";
import "./App.css";

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
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "history",
        element: <History />,
      },
    ],
  },
  // {
  //   path: '/dashboard/profile',
  //   element: <Profile />
  // },
  // {
  //   path: '/dashboard/history',
  //   element: <History />
  // },
  {
    path: "/lobby",
    element: <Lobby />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
