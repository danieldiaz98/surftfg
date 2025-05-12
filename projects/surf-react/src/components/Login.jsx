import { useState } from "react";
import "./styles/RegisterStyle.css"; // Importamos el archivo CSS
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom";
import Password from "../Password/Password";

function Login() {

  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {session, signInUser } = UserAuth()
  //console.log(session)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    const { session, error } = await signInUser(email, password);

    if (error) {
      setError(error);
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      navigate("/#");
    }

    if (session) {
      closeModal();
      setError("");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Registro de Usuario</h2>

        <form onSubmit={handleLogin}>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Ingrese su email"
            onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" placeholder="Ingrese su contraseña"
            onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100">
            Inicia Sesión
          </button>
        </form>
        <p>
          ¿No tienes cuenta? <Link to="/Registro" className="mt-10px">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
