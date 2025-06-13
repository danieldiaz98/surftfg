import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { AuthContextProvider } from "./context/AuthContext";
import AppWrapper from "./AppWrapper";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <AppWrapper />
    </AuthContextProvider>
  </StrictMode>
);
