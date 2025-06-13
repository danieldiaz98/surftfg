import { createBrowserRouter } from 'react-router-dom'
import App from "./App"
import Register from './components/Register'
import Login from './components/Login'
import SpotPage from './components/SpotPage'
import SpotsMap from './components/SpotsMap'
import Spots from './components/Spots'
import Profile from './components/Profile'
import FollowList from './components/FollowList'
import UserExplorer from './components/UserExplorer'
import PrivateRoute from './components/PrivateRoute'
import FavoritesPage from './components/FavoritesPage'
import Marketplace from './components/MarketPlace'

export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/Login", element: <Login /> },
    { path: "/Registro", element: <Register /> },
    { path: "/Perfil", element: <Profile /> },
    { path: "/Perfil/:id", element: <Profile /> },
    { path: "/Perfil/:id/seguidores", element: <FollowList /> },
    { path: "/Perfil/:id/siguiendo", element: <FollowList /> },
    { 
      path: "/Explore", 
      element: (
        <PrivateRoute>
          <UserExplorer />
        </PrivateRoute>
      ) 
    },
    { path: "/SpotsMap", element: <SpotsMap /> },
    { path: "/Spots", element: <Spots /> },
    { path: "/Spot/:spotId", element: <SpotPage /> },
    { path: "/Favoritos", element: <FavoritesPage /> },
    { path: "/Marketplace", element: <Marketplace /> }

])
