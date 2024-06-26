import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { History } from "./components/History";
import { Game } from "./components/Game";
import { Lobby } from "./components/Lobby";
import { SecuredRoute } from "./components/SecuredRoute";
import { Landing } from "./components/Landing";
import { SocketProvider } from "./context/Context.tsx";
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
  return (
    <>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </>
  );
}

export default App;
