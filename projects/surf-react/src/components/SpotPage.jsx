import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpotByName } from "../supabase/spotServices";
import getCoordinatesFromPlaceNameGoogle from "../SpotInfo/Location";
import getWeatherData from "../SpotInfo/Weather";
import Navbar from "./Navbar";

function SpotPage() {
    const { spotName } = useParams();
    const decodedName = decodeURIComponent(spotName);
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coordinates, setCoordinates] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        async function fetchSpot() {
            const data = await getSpotByName(decodedName);
            setSpot(data);
            setLoading(false);
        }
        fetchSpot();
    }, [decodedName]);

    useEffect(() => {
        if (spot) {
            const spotNamePlusLocationName = `${decodedName}, ${spot.Location}`;
            getCoordinatesFromPlaceNameGoogle(spotNamePlusLocationName)
                .then((coords) => {
                    setCoordinates(coords);
                    console.log("Coordenadas:", coords);
                })
                .catch((error) => {
                    console.error("Error obteniendo coordenadas:", error);
                });
        }
    }, [spot]);

    useEffect(() => {
        if (coordinates) {
            getWeatherData(coordinates.lat, coordinates.lng)
                .then((data) => {
                    setWeatherData(data);
                    console.log("Datos meteorológicos:", data);
                })
                .catch((error) => {
                    console.error("Error obteniendo datos meteorológicos:", error);
                });
        }
    }, [coordinates]);
    


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
                        {/* Datos meteorológicos */}
                        {weatherData && (
                        <div className="mt-5 p-4 rounded shadow bg-light text-start">
                            <h4 className="mb-4">Condiciones meteorológicas (última hora)</h4>
                            <div className="row">
                            <div className="col-md-6 mb-3">
                                <strong>Altura de ola:</strong> {weatherData.waveHeight?.sg ?? "N/D"} m
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Periodo de ola:</strong> {weatherData.wavePeriod?.sg ?? "N/D"} s
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Dirección de ola:</strong> {weatherData.waveDirection?.sg ?? "N/D"}°
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Velocidad del viento:</strong> {weatherData.windSpeed?.sg ?? "N/D"} m/s
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Dirección del viento:</strong> {weatherData.windDirection?.sg ?? "N/D"}°
                            </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SpotPage;
