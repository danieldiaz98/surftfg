import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import SpotCard from "./SpotCard";
import { getAllSpots } from "../supabase/spotServices";
import { Form } from "react-bootstrap";

function Spots() {
  const [spots, setSpots] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchSpots() {
      const spotsData = await getAllSpots();
      setSpots(spotsData);
    }
    fetchSpots();
  }, []);

  const filteredSpots = spots.filter((spot) => {
    const text = searchText.toLowerCase();
    return (
      spot.name?.toLowerCase().includes(text) ||
      spot.Location?.toLowerCase().includes(text)
    );
  });

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-4">Surf spots populares</h2>

        <Form.Control
          type="text"
          placeholder="Buscar por nombre o ubicación"
          className="mb-4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="row g-4">
          {filteredSpots.length === 0 ? (
            <p className="text-muted text-center">No se encontraron spots.</p>
          ) : (
            filteredSpots.map((spot) => (
              <div key={spot.id} className="col-sm-6 col-md-4">
                <SpotCard
                  id={spot.id}
                  name={spot.name}
                  location={spot.Location}
                  imageUrl={spot.image_url}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Spots;
