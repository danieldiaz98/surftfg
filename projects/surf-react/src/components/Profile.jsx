import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { Spinner, Button, Card, Image } from "react-bootstrap";

function Profile() {
  const { session } = UserAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!session) {
      navigate("/Login");
      return;
    }

    const fetchPerfil = async () => {
      setLoading(true);
      const { data, error } = await client
        .from("profiles")
        .select("nombre, apellidos, photo_url")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setPerfil(data);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, [session, navigate]);

  const handleUploadFotoPrincipal = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-profile.${fileExt}`;

      // Sube la imagen al bucket avatars
      const { error: uploadError } = await client.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError.message);
        setLoading(false);
        return;
      }

      // Obtiene la URL pública
      const { data: { publicUrl } } = client.storage.from("avatars").getPublicUrl(fileName);

      // Actualiza el perfil con la nueva URL
      const { error: updateError } = await client
        .from("profiles")
        .update({ photo_url: publicUrl })
        .eq("id", session.user.id);

      if (updateError) {
        console.error("Error actualizando foto principal en perfil:", updateError.message);
      } else {
        setPerfil((prev) => ({ ...prev, photo_url: publicUrl }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!perfil) return <Spinner animation="border" className="m-5" />;

  return (
    <>
      <Navbar />
      <div className="container mt-5 d-flex flex-column align-items-center">
        <Card className="shadow-lg p-4 text-center" style={{ maxWidth: "600px", width: "100%" }}>
          <div className="mb-3 position-relative d-inline-block">
            <Image
              src={perfil.photo_url || "/default-avatar.png"}
              alt="Foto de perfil"
              roundedCircle
              style={{ width: "140px", height: "140px", objectFit: "cover", border: "4px solid #007bff" }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadFotoPrincipal}
              style={{ display: "none" }}
              accept="image/*"
            />
            <Button
              variant="outline-primary"
              size="sm"
              className="position-absolute bottom-0 end-0"
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
            >
              {loading ? "Subiendo..." : "Cambiar"}
            </Button>
          </div>

          <h3>{perfil.nombre} {perfil.apellidos}</h3>
          <p className="text-muted">{session.user.email}</p>
        </Card>
      </div>
    </>
  );
}

export default Profile;
