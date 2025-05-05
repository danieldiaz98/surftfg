import React from "react";
import Navbar from "./Navbar";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px"
};

const center = {
  lat: -34.6037,
  lng: -58.3816
};

function SpotsMap() {
  const apiKey = 'AIzaSyBv6ANWObrc79ReQ8h2iGqW6MZbRkZkg6s';

  return (
    <>
      <Navbar />
      <div>
        <h1>Mapa de Spots</h1>
        <p>Este es el mapa de spots.</p>
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          >
            {/* Aquí puedes añadir marcadores u otros componentes */}
          </GoogleMap>
        </LoadScript>
      </div>
    </>
  );
}

export default SpotsMap;
