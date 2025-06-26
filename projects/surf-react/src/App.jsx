import Navbar from "./components/Navbar";
import SpotCard from "./components/SpotCard";
import LandingPage from "./components/LandingPage";
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
      <LandingPage/>
    </>
  )
}

export default App;