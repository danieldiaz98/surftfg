import { useState } from "react";
import "./styles/RegisterStyle.css";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Password from "../Password/Password";
import Navbar from "./Navbar";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const passwordValidation = new Password(password, repeatPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!passwordValidation.isValid()) {
      alert("Las contraseñas no coinciden o no cumplen los requisitos.");
      setLoading(false);
      return;
    }

    try {
      const result = await signUpNewUser(email, passwordValidation.password);

      if (result.success) {
        const user = result.data.user;

        const { error: profileError } = await client
          .from("profiles")
          .insert([
            {
              id: user.id,
              nombre,
              apellidos,
              email
            },
          ]);

        if (profileError) {
          console.error("Error al guardar perfil:", profileError);
          alert("Usuario creado, pero hubo un error al guardar los datos del perfil.");
        } else {
          navigate("/Login");
        }
      } else {
        setErrorMsg(result.error.message || "Ocurrió un error al registrarse.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error inesperado al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4" style={{ width: "400px" }}>
          <h2 className="text-center mb-4">Registro de Usuario</h2>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Apellidos</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese sus apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Repite la contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repita su contraseña"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-100">
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p className="mt-3 text-center">
            ¿Ya estás registrado? <Link to="/Login">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
