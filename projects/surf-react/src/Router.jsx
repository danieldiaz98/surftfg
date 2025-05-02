import { createBrowserRouter } from 'react-router-dom'
import App from "./App"
import Register from './components/Register'
import Login from './components/Login'
import SpotPage from './components/SpotPage'

export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/Login", element: <Login />},
    { path: "/Registro", element: <Register />},
    { path: "/:spotName", element: <SpotPage /> } 
])