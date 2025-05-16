import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

function Perfil() {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState("/default-avatar.png");

  useEffect(() => {
    if (!session) {
      navigate("/Login");
      return;
    }

    const fetchPerfil = async () => {
      const { data, error } = await client
        .from("profiles")
        .select("nombre, apellidos")
        .eq("id", session.user.id)
        .single();

      if (!error && data) setPerfil(data);
    };

    const fetchFotoPerfil = async () => {
      const { data, error } = await client
        .from("profile_photos")
        .select("photo_url")
        .eq("user_id", session.user.id)
        .order("uploaded_at", { ascending: false })
        .limit(1);

      if (!error && data.length > 0) {
        setFotoPerfil(data[0].photo_url);
      }
    };

    fetchPerfil();
    fetchFotoPerfil();
  }, [session, navigate]);

  if (!perfil) return null;

  return (
    <>
      <Navbar />
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow-lg p-4" style={{ maxWidth: "2000px", width: "100%" }}>
          <div className="text-center">
            <img
              src={fotoPerfil}
              alt="Foto de perfil"
              className="rounded-circle shadow mb-4"
              style={{ width: "140px", height: "140px", objectFit: "cover", border: "4px solid #007bff" }}
            />
            <h3 className="mb-1">{perfil.nombre} {perfil.apellidos}</h3>
            <p className="text-muted mb-3">{session.user.email}</p>
          </div>

          <hr />
        </div>
      </div>
    </>
  );
}

export default Perfil;
