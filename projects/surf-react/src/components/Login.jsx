import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "./styles/RegisterStyle.css";
import Navbar from "./Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signInUser(email, password);

      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate("/Perfil"); // Redirige al home o dashboard
      }
    } catch (err) {
      setErrorMsg("Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4" style={{ width: "400px" }}>
          <h2 className="text-center mb-4">Inicia Sesión</h2>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-100">
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="mt-3 text-center">
            ¿No tienes cuenta? <Link to="/Registro">Regístrate</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
