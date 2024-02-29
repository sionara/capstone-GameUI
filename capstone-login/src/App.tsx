import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from "./login";
import { Register } from './register';

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
  }
]);

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
