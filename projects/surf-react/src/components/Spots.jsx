import React from "react";
import Navbar from "./Navbar";
import SpotCard from "./SpotCard";
import { getAllSpots } from "../supabase/spotServices";
import { useEffect, useState } from "react";

function Spots() {
    const [spots, setSpots] = useState([]);
    useEffect (() => {
      async function fetchSpots() {
        const spotsData = await getAllSpots();
        setSpots(spotsData);
      }
      fetchSpots();
    }, [])
  return (
    <>
      <Navbar/>
      <h2>Surf spots populares</h2>
      <div className="spot_cards_container">
        {spots.map((spot) => (
          <SpotCard
            key={spot.id}
            name={spot.Name}
            location={spot.Location}
            imageUrl={spot.image_url}
          />
        ))}

      </div>
    </>
  )
}

export default Spots;