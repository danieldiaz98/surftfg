import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

function Profile() {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState("/default-avatar.jpg"); // valor por defecto

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

      if (!error) setPerfil(data);
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
      <div className="container mt-5">
        <div className="card shadow p-4 text-center">
          <h2 className="mb-4">Mi Perfil</h2>

          {/* Imagen de perfil redonda */}
          <img
            src={fotoPerfil}
            alt="Foto de perfil"
            className="rounded-circle mb-4 border"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />

          <p><strong>Nombre:</strong> {perfil.nombre}</p>
          <p><strong>Apellidos:</strong> {perfil.apellidos}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
        </div>
      </div>
    </>
  );
}

export default Profile;
