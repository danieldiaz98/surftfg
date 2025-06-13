import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/surf-hero.jpg";
import { UserAuth } from "../context/AuthContext";

function LandingPage() {
  const { session } = UserAuth();

  return (
    <div>
      <header
        className="bg-dark text-white text-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <h1 className="display-3 fw-bold">Bienvenido a Waver</h1>
        <p className="lead">Tu comunidad de surfistas, spots y condiciones en tiempo real</p>
        <div className="mt-4">
          {!session && (
            <Link to="/Registro" className="btn btn-primary btn-lg mx-2">
              Regístrate
            </Link>
          )}
          <Link to="/spots" className="btn btn-outline-light btn-lg mx-2">
            Ver Spots
          </Link>
        </div>
      </header>

      <section className="container py-5">
        <h2 className="text-center mb-4">¿Qué puedes hacer?</h2>
        <div className="row text-center">
          <div className="col-md-3">
            <i className="bi bi-map fs-1 mb-3 text-primary"></i>
            <h5>Explora el mapa</h5>
            <p>Visualiza spots exactos con información detallada.</p>
          </div>
          <div className="col-md-3">
            <i className="bi bi-cloud-sun fs-1 mb-3 text-info"></i>
            <h5>Consulta el clima</h5>
            <p>Accede a datos actualizados del viento, olas y mareas.</p>
          </div>
          <div className="col-md-3">
            <i className="bi bi-person-lines-fill fs-1 mb-3 text-success"></i>
            <h5>Conéctate</h5>
            <p>Crea tu perfil y contacta con otros surfistas.</p>
          </div>
          <div className="col-md-3">
            <i className="bi bi-star fs-1 mb-3 text-warning"></i>
            <h5>Spots destacados</h5>
            <p>Descubre los lugares favoritos de la comunidad.</p>
          </div>
        </div>
      </section>

      <footer className="bg-light py-4 text-center text-muted">
        <p>&copy; {new Date().getFullYear()} Waver. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
