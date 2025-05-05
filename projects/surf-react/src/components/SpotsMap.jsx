import React from "react";
import Navbar from "./Navbar";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "1000px"
};

const center = {
  lat: 27.9915,
  lng: -15.4208
};

function SpotsMap() {
  const apiKey = 'AIzaSyDoc4OW1DbayNM87H7QX5LGiwxouWZDzSw';

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
