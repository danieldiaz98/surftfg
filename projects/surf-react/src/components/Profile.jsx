import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import ProfileHeader from "./ProfileHeader";
import Gallery from "./Gallery";
import PhotoUploader from "./PhotoUploader";
import { Spinner } from "react-bootstrap";

function Profile() {
  const { session } = UserAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const profileFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  useEffect(() => {
    if (!session) {
      navigate("/Login");
      return;
    }

    const fetchPerfil = async () => {
      setLoading(true);
      const { data, error } = await client
        .from("profiles")
        .select("nombre, apellidos, photo_url, description")
        .eq("id", session.user.id)
        .single();

      if (error) console.error(error);
      else setPerfil(data);

      setLoading(false);
    };

    const fetchGalleryPhotos = async () => {
      const { data, error } = await client
        .from("profile_photos")
        .select("id, photo_url, uploaded_at")
        .eq("user_id", session.user.id)
        .order("uploaded_at", { ascending: false });

      if (error) console.error(error);
      else setGalleryPhotos(data || []);
    };

    fetchPerfil();
    fetchGalleryPhotos();
  }, [session, navigate]);

  const handleUploadFotoPrincipal = async (file) => {
    try {
      setLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-profile.${fileExt}`;

      const { error: uploadError } = await client.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error(uploadError.message);
        return;
      }

      const { data: { publicUrl } } = client.storage.from("avatars").getPublicUrl(fileName);

      const { error: updateError } = await client
        .from("profiles")
        .update({ photo_url: publicUrl })
        .eq("id", session.user.id);

      if (!updateError) {
        setPerfil((prev) => ({ ...prev, photo_url: publicUrl }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadGalleryPhoto = async (file) => {
    try {
      setUploadingGallery(true);
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const fileName = `${session.user.id}-gallery-${timestamp}.${fileExt}`;

      const { error: uploadError } = await client.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error(uploadError.message);
        return;
      }

      const { data: { publicUrl } } = client.storage.from("avatars").getPublicUrl(fileName);

      const { data, error: insertError } = await client.from("profile_photos").insert([
        {
          user_id: session.user.id,
          photo_url: publicUrl,
          uploaded_at: new Date().toISOString(),
        },
      ]).select();

      if (!insertError && data?.[0]) {
        setGalleryPhotos((prev) => [data[0], ...prev]);
      }
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeletePhoto = async (photoId, photoUrl) => {
    try {
      // Extraer el nombre del archivo del URL de manera segura
      const fileName = new URL(photoUrl).pathname.split("/").pop();

      // Eliminar del storage
      const { error: deleteStorageError } = await client.storage
        .from("avatars")
        .remove([fileName]);

      if (deleteStorageError) {
        console.error("Error eliminando del storage:", deleteStorageError.message);
        return;
      }

      // Eliminar de la base de datos
      const { error: deleteDbError } = await client
        .from("profile_photos")
        .delete()
        .eq("id", photoId)
        .eq("user_id", session.user.id);

      if (deleteDbError) {
        console.error("Error eliminando de la base de datos:", deleteDbError.message);
        return;
      }

      // Actualizar estado local
      setGalleryPhotos((prev) => prev.filter((p) => p.id !== photoId));

    } catch (err) {
      console.error("Error eliminando la foto:", err);
    }
  };

  if (!perfil) return <Spinner animation="border" className="m-5" />;

  return (
    <>
      <Navbar />
      <div className="container mt-5 d-flex flex-column align-items-center">
        <ProfileHeader
          perfil={perfil}
          loading={loading}
          fileInputRef={profileFileInputRef}
          onUpload={(e) => handleUploadFotoPrincipal(e.target.files[0])}
          email={session?.user?.email}
        />
        <PhotoUploader
          uploading={uploadingGallery}
          fileInputRef={galleryFileInputRef}
          onUpload={(e) => handleUploadGalleryPhoto(e.target.files[0])}
        />
        <Gallery
          photos={galleryPhotos}
          selectedPhoto={selectedPhoto}
          setSelectedPhoto={setSelectedPhoto}
          onDelete={handleDeletePhoto}
        />
      </div>
    </>
  );
}

export default Profile;
