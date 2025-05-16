import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { Spinner, Button, Card, Image, Row, Col, Modal } from "react-bootstrap";

function Profile() {
  const { session } = UserAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // NUEVO

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

    const fetchGalleryPhotos = async () => {
      const { data, error } = await client
        .from("profile_photos")
        .select("id, photo_url, uploaded_at")
        .eq("user_id", session.user.id)
        .order("uploaded_at", { ascending: false });

      if (error) {
        console.error("Error fetching gallery photos:", error);
      } else {
        setGalleryPhotos(data || []);
      }
    };

    fetchPerfil();
    fetchGalleryPhotos();
  }, [session, navigate]);

  const handleUploadFotoPrincipal = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-profile.${fileExt}`;

      const { error: uploadError } = await client.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError.message);
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

  const handleUploadGalleryPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingGallery(true);
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const fileName = `${session.user.id}-gallery-${timestamp}.${fileExt}`;

      const { error: uploadError } = await client.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Error al subir imagen a la galería:", uploadError.message);
        return;
      }

      const { data: { publicUrl } } = client.storage.from("avatars").getPublicUrl(fileName);

      const { error: insertError } = await client.from("profile_photos").insert([
        {
          user_id: session.user.id,
          photo_url: publicUrl,
          uploaded_at: new Date().toISOString(),
        },
      ]);

      if (!insertError) {
        setGalleryPhotos((prev) => [{ photo_url: publicUrl }, ...prev]);
      }
    } finally {
      setUploadingGallery(false);
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
              ref={profileFileInputRef}
              onChange={handleUploadFotoPrincipal}
              style={{ display: "none" }}
              accept="image/*"
            />
            <Button
              variant="outline-primary"
              size="sm"
              className="position-absolute bottom-0 end-0"
              onClick={() => profileFileInputRef.current.click()}
              disabled={loading}
            >
              {loading ? "Subiendo..." : "Cambiar"}
            </Button>
          </div>

          <h3>{perfil.nombre} {perfil.apellidos}</h3>
          <p className="text-muted">{session.user.email}</p>

          <hr />
          <div className="d-flex justify-content-between align-items-center mb-3 w-100">
            <h5>Galería de Fotos</h5>
            <input
              type="file"
              ref={galleryFileInputRef}
              onChange={handleUploadGalleryPhoto}
              style={{ display: "none" }}
              accept="image/*"
            />
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => galleryFileInputRef.current.click()}
              disabled={uploadingGallery}
            >
              {uploadingGallery ? "Subiendo..." : "Añadir Foto"}
            </Button>
          </div>

          <Row xs={2} md={3} lg={4} className="g-3">
            {galleryPhotos.length === 0 && <p className="text-muted">No hay fotos en la galería.</p>}
            {galleryPhotos.map((photo, idx) => (
              <Col key={photo.id || idx}>
                <Card onClick={() => setSelectedPhoto(photo.photo_url)} style={{ cursor: "pointer" }}>
                  <Card.Img
                    variant="top"
                    src={photo.photo_url}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>

      {/* Modal para ver imagen ampliada */}
      <Modal
        show={!!selectedPhoto}
        onHide={() => setSelectedPhoto(null)}
        centered
        size="lg"
      >
        <Modal.Body className="p-0 text-center bg-dark">
          <Image
            src={selectedPhoto}
            alt="Vista ampliada"
            fluid
            style={{ maxHeight: "80vh", objectFit: "contain" }}
          />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setSelectedPhoto(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Profile;
