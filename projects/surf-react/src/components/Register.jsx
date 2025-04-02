import { useState } from "react";
import "./styles/RegisterStyle.css"; // Importamos el archivo CSS
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext"

function RegistroUsuario() {

  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");

  const {session, signUpNewUser } = UserAuth()
  console.log(session)

  const handleSubmit = async (e) => {
    e.preventDefault()
    //setLoading(true)
    try {
      const result = await signUpNewUser(email, password)
      if (result.success) {
        alert("YekalePuto")
      }
    } catch (err) {
      SpeechSynthesisErrorEvent("an error occurred")
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Registro de Usuario</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" placeholder="Ingrese su nombre" />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input type="text" className="form-control" placeholder="Ingrese sus apellidos" />
          </div>

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

          <div className="mb-3">
            <label className="form-label">Repite la contraseña</label>
            <input type="password" className="form-control" placeholder="Repita su contraseña" />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistroUsuario;
