import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import SpotCard from "./SpotCard";
import { getAllSpots } from "../supabase/spotServices";

function Spots() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    async function fetchSpots() {
      const spotsData = await getAllSpots();
      setSpots(spotsData);
    }
    fetchSpots();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-4">Surf spots populares</h2>
        
        <div className="row g-4">
          {spots.map((spot) => (
            <div key={spot.id} className="col-sm-6 col-md-4">
              <SpotCard
                id={spot.id}
                name={spot.Name}
                location={spot.Location}
                imageUrl={spot.image_url}
              />

            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Spots;
