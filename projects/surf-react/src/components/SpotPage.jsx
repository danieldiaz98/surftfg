import React from "react";
import { useParams, useLocation } from "react-router-dom";

function SpotPage() {
    const { spotName } = useParams();
    const location = useLocation();
    const { imageUrl, location: spotLocation } = location.state || {};

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                    {/* Título del spot */}
                    <h1 className="display-4 mb-4">{decodeURIComponent(spotName)}</h1>

                    {/* Imagen del spot como parte del contenido */}
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={spotName}
                            className="img-fluid rounded shadow-sm mb-4"
                            style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
                        />
                    )}

                    {/* Ubicación */}
                    <h5 className="text-muted mb-3">{spotLocation}</h5>

                    {/* Descripción */}
                    <p className="fs-5">
                        Bienvenido a {decodeURIComponent(spotName)}. Este spot es conocido por su belleza única
                        y su entorno especial. Aquí puedes añadir más detalles sobre actividades, historia o
                        recomendaciones para los visitantes.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SpotPage;
