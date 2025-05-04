import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpotByName } from "../supabase/spotServices";
import Navbar from "./Navbar";

function SpotPage() {
    const { spotName } = useParams();
    const decodedName = decodeURIComponent(spotName);
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSpot() {
            const data = await getSpotByName(decodedName);
            setSpot(data);
            setLoading(false);
        }
        fetchSpot();
    }, [decodedName]);

    if (loading) {
        return (
            <>
                <Navbar />
            </>
        );
    }
    
    if (!spot) {
        return (
            <>
                <Navbar />
                <div className="container text-center py-5">
                    <h2>Spot no encontrado</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        {/* Título del spot */}
                        <h1 className="display-4 mb-4">{spotName}</h1>

                        {/* Imagen del spot como parte del contenido */}
                        {spot.image_url && (
                            <img
                                src={spot.image_url}
                                alt={spot.Name}
                                className="img-fluid rounded shadow-sm mb-4"
                                style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
                            />
                        )}

                        {/* Ubicación */}
                        <h5 className="text-muted mb-3">{spot.Location}</h5>

                        {/* Descripción */}
                        <p className="fs-5">
                            {spot.Description}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SpotPage;
