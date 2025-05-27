import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import getCoordinatesFromPlaceNameGoogle from "../SpotInfo/Location";
import getWeatherData from "../SpotInfo/Weather";
import { client } from "../supabase/client";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  marginTop: "20px"
};

function SpotPage() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    async function fetchSpot() {
      const { data, error } = await client
        .from("spots")
        .select("*")
        .eq("id", spotId)
        .single();

      if (error) {
        console.error("Error al obtener el spot:", error.message);
      } else {
        setSpot(data);
      }
      setLoading(false);
    }

    fetchSpot();
  }, [spotId]);

  useEffect(() => {
    if (spot) {
      const fullPlaceName = `${spot.name}, ${spot.Location}`;
      getCoordinatesFromPlaceNameGoogle(fullPlaceName)
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
        <div className="container text-center py-5">
          <p>Cargando spot...</p>
        </div>
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
            <h1 className="display-4 mb-4">{spot.name}</h1>

            {spot.image_url && (
              <img
                src={spot.image_url}
                alt={spot.name}
                className="img-fluid rounded shadow-sm mb-4"
                style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
              />
            )}

            <h5 className="text-muted mb-3">{spot.Location}</h5>
            <p className="fs-5">{spot.Description}</p>

            {/* Datos meteorológicos */}
            <div className="mt-5 p-4 rounded shadow bg-light text-start">
              <h4 className="mb-4">Condiciones meteorológicas (última hora)</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>Altura de ola:</strong>{" "}
                  {weatherData?.waveHeight?.sg ?? "N/D"} m
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Periodo de ola:</strong>{" "}
                  {weatherData?.wavePeriod?.sg ?? "N/D"} s
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Dirección de ola:</strong>{" "}
                  {weatherData?.waveDirection?.sg ?? "N/D"}°
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Velocidad del viento:</strong>{" "}
                  {weatherData?.windSpeed?.sg ?? "N/D"} m/s
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Dirección del viento:</strong>{" "}
                  {weatherData?.windDirection?.sg ?? "N/D"}°
                </div>
              </div>
            </div>

            {/* Mini mapa con marcador */}
            {coordinates && (
              <div className="mt-5">
                <h4 className="mb-3">Ubicación en el mapa</h4>
                <LoadScriptNext googleMapsApiKey="AIzaSyDoc4OW1DbayNM87H7QX5LGiwxouWZDzSw">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={coordinates}
                    zoom={14}
                  >
                    <Marker
                      position={coordinates}
                      title={spot.name}
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
                          "_blank"
                        )
                      }
                    />
                  </GoogleMap>
                </LoadScriptNext>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SpotPage;
