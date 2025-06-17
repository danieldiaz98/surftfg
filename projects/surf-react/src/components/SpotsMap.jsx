import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { GoogleMap, LoadScriptNext, Marker, InfoWindow } from "@react-google-maps/api";
import { getAllSpots } from "../supabase/spotServices";
import getCoordinatesFromPlaceNameGoogle from "../SpotInfo/Location";
import { Link } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  marginTop: "20px"
};

const center = {
  lat: 27.9579905,
  lng: -15.761588
};

function SpotsMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  console.log("API Key:", apiKey);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    async function fetchSpotsWithCoordinates() {
      try {
        const allSpots = await getAllSpots();
        const spotsWithCoords = await Promise.all(
          allSpots.map(async (spot) => {
            const fullPlaceName = `${spot.name}, ${spot.Location}`;
            const coords = await getCoordinatesFromPlaceNameGoogle(fullPlaceName);
            return coords ? { ...spot, coordinates: coords } : null;
          })
        );

        setSpots(spotsWithCoords.filter(Boolean));
      } catch (error) {
        console.error("Error cargando spots:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpotsWithCoordinates();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold">Mapa de Spots</h1>
          <p className="lead text-muted">Haz clic en un marcador para ver más detalles del spot.</p>
        </div>

        {loading ? (
          <p className="text-center">Cargando mapa...</p>
        ) : (
          <div className="d-flex justify-content-center">
            <LoadScriptNext googleMapsApiKey={apiKey}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
              >
                {spots.map((spot, index) => (
                  <Marker
                    key={index}
                    position={spot.coordinates}
                    title={spot.name}
                    onClick={() => setSelectedSpot(spot)}
                  />
                ))}

                {selectedSpot && (
                  <InfoWindow
                  position={selectedSpot.coordinates}
                  onCloseClick={() => setSelectedSpot(null)}
                >
                  <div className="p-2 rounded shadow-sm bg-white text-center" style={{ maxWidth: "250px" }}>
                    <h6 className="mb-2 text-primary fw-bold">
                      {selectedSpot.name}
                    </h6>
                
                    <Link
                      to={`/Spot/${encodeURIComponent(selectedSpot.id)}`}
                      className="btn btn-outline-primary btn-sm d-block mb-2"
                    >
                      Ver detalles
                    </Link>
                
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.coordinates.lat},${selectedSpot.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm d-block"
                    >
                      Obtener indicaciones
                    </a>
                  </div>
                </InfoWindow>                
                )}
              </GoogleMap>
            </LoadScriptNext>
          </div>
        )}
      </div>
    </>
  );
}

export default SpotsMap;
