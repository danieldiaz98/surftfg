import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

function Perfil() {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState("/default-avatar.png");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!session) {
      navigate("/Login");
      return;
    }

    const fetchPerfil = async () => {
      const { data } = await client
        .from("profiles")
        .select("nombre, apellidos")
        .eq("id", session.user.id)
        .single();
      if (data) setPerfil(data);
    };

    const fetchFotoPerfil = async () => {
      const { data } = await client
        .from("profile_photos")
        .select("photo_url")
        .eq("user_id", session.user.id)
        .order("uploaded_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setFotoPerfil(data[0].photo_url);
      }
    };

    fetchPerfil();
    fetchFotoPerfil();
  }, [session, navigate]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${session.user.id}-${Date.now()}.${file.name.split(".").pop()}`;
    const { data, error } = await client.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error al subir imagen:", error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = client.storage.from("avatars").getPublicUrl(fileName);

    // Guarda la URL en la base de datos
    const insertResult = await client.from("profile_photos").insert([
      {
        user_id: session.user.id,
        photo_url: publicUrl,
        uploaded_at: new Date().toISOString(),
      },
    ]);

    if (!insertResult.error) {
      setFotoPerfil(publicUrl); // Actualiza visualmente
    }
  };

  if (!perfil) return null;

  return (
    <>
      <Navbar />
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "500px", width: "100%" }}>
          <img
            src={fotoPerfil}
            alt="Foto de perfil"
            className="rounded-circle shadow mb-3"
            style={{ width: "140px", height: "140px", objectFit: "cover", border: "4px solid #007bff" }}
          />
          <h3>{perfil.nombre} {perfil.apellidos}</h3>
          <p className="text-muted">{session.user.email}</p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: "none" }}
            accept="image/*"
          />
          <button
            className="btn btn-outline-primary btn-sm mt-3"
            onClick={() => fileInputRef.current.click()}
          >
            Cambiar foto de perfil
          </button>
        </div>
      </div>
    </>
  );
}

export default Perfil;
