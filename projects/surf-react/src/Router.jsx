import { createBrowserRouter } from 'react-router-dom'
import App from "./App"
import Register from './components/Register'
import Login from './components/Login'
import SpotPage from './components/SpotPage'
import SpotsMap from './components/SpotsMap'
import Spots from './components/Spots'
import Profile from './components/Profile'

export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/Login", element: <Login />},
    { path: "/Registro", element: <Register />},
    { path: "/Perfil", element: <Profile /> },
    { path: "/SpotsMap", element: <SpotsMap />},
    { path: "/Spots", element: <Spots />},
    { path: "/:spotName", element: <SpotPage /> } 
])