import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { getFavoriteSpotsForUser } from "../supabase/spotServices";
import Navbar from "./Navbar";
import SpotCard from "./SpotCard";

function FavoritesPage() {
  const { session } = UserAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session) return;

      const spots = await getFavoriteSpotsForUser(session.user.id);
      setFavorites(spots);
      setLoading(false);
    };

    fetchFavorites();
  }, [session]);

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-5">
          <h2>Debes iniciar sesión para ver tus favoritos</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-4">Mis Spots Favoritos</h2>
        {loading ? (
          <p className="text-center">Cargando favoritos...</p>
        ) : favorites.length === 0 ? (
          <p className="text-center">Aún no tienes spots marcados como favoritos.</p>
        ) : (
          <div className="row g-4">
            {favorites.map((spot) => (
              <div key={spot.id} className="col-sm-6 col-md-4">
                <SpotCard
                  id={spot.id}
                  name={spot.name}
                  location={spot.location}
                  imageUrl={spot.image_url}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FavoritesPage;
