import { useEffect, useState } from "react";
import { getAllSpots, getSpotByName } from "./spotServices";

function SpotList() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    async function fetchSpots() {
      try {
        const data = await getAllSpots();
        console.log("Spots:", data);
        setSpots(data);
      } catch (error) {
        console.error("Error al obtener spots:", error);
      }
    }

    fetchSpots();
  }, []);

  const spot = getSpotByName("El Frontón");
  console.log("Spot:", spot);

  return null;
}

export default SpotList;