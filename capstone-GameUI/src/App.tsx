import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from "./components/Login";
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { History } from './components/History';
import { Game } from './components/Game';
import './App.css'

//ROUTING
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/dashboard/profile',
    element: <Profile />
  },
  {
    path: '/dashboard/history',
    element: <History />
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
