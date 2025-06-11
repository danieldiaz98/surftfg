// src/AppWrapper.jsx
import { Spinner } from "react-bootstrap";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { UserAuth } from "./context/AuthContext";

export default function AppWrapper() {
  const { session } = UserAuth();

  if (session === undefined) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
