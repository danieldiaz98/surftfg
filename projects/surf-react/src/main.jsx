import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import { AuthContextProvider } from './context/AuthContext'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <AuthContextProvider>
        <RouterProvider router={router}/>
      </AuthContextProvider>
    </>
  </StrictMode>,
)
