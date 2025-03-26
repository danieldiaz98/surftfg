import { useState } from "react";
import "./styles/RegisterStyle.css"; // Importamos el archivo CSS

function RegistroUsuario() {

  return (
    <div className="container">
        <h2>Registro de usuario</h2><br/>
        
        <form>
                
            <label>Nombre</label><br/>
            <input type="text" className="name"></input><br/>

            <label>Apellidos</label><br/>
            <input type="text" className="surnames"></input><br/>

            <label>Email</label><br/>
            <input type="text" className="mail"></input><br/>

            <label>Contraseña</label><br/>
            <input type="text" className="password"></input><br/>

            <label>Repite la contraseña</label><br/>
            <input type="text" className="repeatPassword"></input><br/>

            <button type="submit" className="submitButton">Registrarse</button>
        </form>
        
    </div>
  );
}

export default RegistroUsuario;
