import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import ProfileHeader from "./ProfileHeader";
import Gallery from "./Gallery";
import PhotoUploader from "./PhotoUploader";
import FollowStats from "./FollowStats";

import { Spinner, Card } from "react-bootstrap";

function Profile() {
  const { id } = useParams();
  const { session } = UserAuth();
  const navigate = useNavigate();

  const isOwnProfile = !id || id === session?.user?.id;
  const userId = id || session.user.id;

  const [perfil, setPerfil] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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
        .select("nombre, apellidos, photo_url, description, email")
        .eq("id", userId)
        .single();

      if (error) console.error(error);
      else setPerfil(data);

      setLoading(false);
    };

    const fetchGalleryPhotos = async () => {
      const cleanProfileId = (userId || "").trim();

      const { data, error } = await client
        .from("profile_photos")
        .select("id, photo_url, uploaded_at")
        .eq("user_id", cleanProfileId)
        .order("uploaded_at", { ascending: false });

      if (error) {
        console.error(error);
        setGalleryPhotos([]);
      } else {
        setGalleryPhotos(data || []);
      }
    };


    const fetchFollowStats = async () => {
      const { count: followers } = await client
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("followed_id", userId);

      const { count: following } = await client
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
    };

    fetchPerfil();
    fetchGalleryPhotos();
    fetchFollowStats();
  }, [session, userId, navigate]);

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
      const fileName = new URL(photoUrl).pathname.split("/").pop();

      const { error: deleteStorageError } = await client.storage
        .from("avatars")
        .remove([fileName]);

      if (deleteStorageError) {
        console.error("Error eliminando del storage:", deleteStorageError.message);
        return;
      }

      const { error: deleteDbError } = await client
        .from("profile_photos")
        .delete()
        .eq("id", photoId)
        .eq("user_id", session.user.id);

      if (deleteDbError) {
        console.error("Error eliminando de la base de datos:", deleteDbError.message);
        return;
      }

      setGalleryPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error("Error eliminando la foto:", err);
    }
  };

  if (!perfil) return <Spinner animation="border" className="m-5" />;

  return (
    <>
      <Navbar />
      <div className="container mt-5 d-flex justify-content-center">
        <Card style={{ maxWidth: "700px", width: "100%" }} className="shadow-lg p-4">
          <ProfileHeader
            perfil={perfil}
            loading={loading}
            fileInputRef={profileFileInputRef}
            onUpload={(e) => handleUploadFotoPrincipal(e.target.files[0])}
            email={perfil?.email || ""}
            profileId={userId}
            currentUserId={session.user.id}
          />

          <FollowStats
            followersCount={followersCount}
            followingCount={followingCount}
            userId={userId}
          />

          <div className="d-flex justify-content-between align-items-center my-2">
            <h5 className="mb-0 text-nowrap">Galería de fotos</h5>
            {isOwnProfile && (
              <PhotoUploader
                uploading={uploadingGallery}
                fileInputRef={galleryFileInputRef}
                onUpload={(e) => handleUploadGalleryPhoto(e.target.files[0])}
              />
            )}
          </div>

          <Gallery
            photos={galleryPhotos}
            selectedPhoto={selectedPhoto}
            setSelectedPhoto={setSelectedPhoto}
            onDelete={isOwnProfile ? handleDeletePhoto : undefined}
          />
        </Card>
      </div>
    </>
  );
}

export default Profile;
