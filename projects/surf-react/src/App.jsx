import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login"
import SpotCard from "./components/SpotCard";
import "./App.css"
import { client } from "./supabase/client";
import Spotsdb from "./supabase/Spotsdb";
import { getAllSpots } from "./supabase/spotServices";
import { useEffect, useState } from "react";

function App() {
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
      <Spotsdb/>
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

export default App;