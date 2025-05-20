import './styles/Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";  // Ajusta el path si hace falta
import { useState } from "react";

function Navbar() {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/Login");
    setExpanded(false);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Waver</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded={expanded ? "true" : "false"} 
          aria-label="Toggle navigation"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${expanded ? " show" : ""}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setExpanded(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/SpotsMap" className="nav-link" onClick={() => setExpanded(false)}>Map</Link>
            </li>
            <li className="nav-item">
              <Link to="/Spots" className="nav-link" onClick={() => setExpanded(false)}>Spots</Link>
            </li>
            {session && (
              <>
                <li className="nav-item">
                  <Link to="/Perfil" className="nav-link" onClick={() => setExpanded(false)}>Perfil</Link>
                </li>
                <li className="nav-item">
                  <Link to="/Explore" className="nav-link" onClick={() => setExpanded(false)}>Explorar</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {!session ? (
              <>
                <Link to="/Login" className="btn btn-outline-primary me-2" onClick={() => setExpanded(false)}>Inicia Sesión</Link>
                <Link to="/Registro" className="btn btn-primary" onClick={() => setExpanded(false)}>Registro</Link>
              </>
            ) : (
              <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
