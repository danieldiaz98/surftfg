import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { client } from "../supabase/client";

function SpotCard({ id, name, location, imageUrl }) {
  const { session } = UserAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      setIsFavorite(false);
      return;
    }

    const checkFavorite = async () => {
      const { data, error } = await client
        .from("favorite_spots")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("spot_id", id)
        .maybeSingle();

      if (!error && data) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
      if (error) {
        console.error("Error al cambiar favorito:", error);
        alert(`Error: ${error.message} (${error.status})`);
    }

    };

    checkFavorite();
  }, [session, id]);

  const handleToggleFavorite = async () => {
    if (!session) return;

    setLoading(true);
    try {
      if (isFavorite) {
        const { error } = await client
          .from("favorite_spots")
          .delete()
          .eq("user_id", session.user.id)
          .eq("spot_id", id);

        if (error) {
            console.error("Error al cambiar favorito:", error);
            alert(`Error: ${error.message} (${error.status})`);
        }


        setIsFavorite(false);
      } else {
        const { error } = await client
          .from("favorite_spots")
          .insert({ user_id: session.user.id, spot_id: id });

        if (error) throw error;

        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error al cambiar favorito:", err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ margin: "10px" }}>
      <img
        src={imageUrl}
        className="card-img-top"
        alt="beach photo"
        style={{ width: "auto", height: "300px" }}
      />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{location}</li>
      </ul>
      <div className="card-body d-flex justify-content-between align-items-center">
        <Link
          to={`/spot/${id}`}
          state={{ name, location, imageUrl }}
          className="card-link"
        >
          Ver spot
        </Link>
        {session && (
          <button
            className={`btn btn-sm ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
            onClick={handleToggleFavorite}
            disabled={loading}
            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            {isFavorite ? "💔" : "❤️"}
          </button>
        )}
      </div>
    </div>
  );
}

export default SpotCard;
