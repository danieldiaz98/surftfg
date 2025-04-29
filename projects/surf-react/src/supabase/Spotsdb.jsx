import { useEffect } from "react";
import { client } from "../supabase/client";

function Spotsdb() {
  useEffect(() => {
    async function fetchSpots() {
      const { data, error } = await client.from('Spots').select('*');

      if (error) {
        console.error('Error al obtener los spots:', error);
        return;
      }

      console.log('Spots obtenidos:', data);
    }

    fetchSpots();
  }, []);

  return null; // no muestra nada
}

export default Spotsdb;
