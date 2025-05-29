import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import getCoordinatesFromPlaceNameGoogle from "../SpotInfo/Location";
import getWeatherData from "../SpotInfo/Weather";
import { client } from "../supabase/client";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { UserAuth } from "../context/AuthContext";
import { Modal } from "react-bootstrap";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  marginTop: "20px",
};

function SpotPage() {
  const { spotId } = useParams();
  const { session } = UserAuth();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchSpot() {
      const { data, error } = await client
        .from("spots")
        .select("*")
        .eq("id", spotId)
        .single();

      if (error) {
        console.error("Error al obtener el spot:", error.message);
      } else {
        setSpot(data);
      }
      setLoading(false);
    }

    fetchSpot();
  }, [spotId]);

  useEffect(() => {
    if (spot) {
      const fullPlaceName = `${spot.name}, ${spot.Location}`;
      getCoordinatesFromPlaceNameGoogle(fullPlaceName)
        .then((coords) => setCoordinates(coords))
        .catch((error) => console.error("Error obteniendo coordenadas:", error));
    }
  }, [spot]);

  useEffect(() => {
    if (coordinates) {
      getWeatherData(coordinates.lat, coordinates.lng)
        .then((data) => setWeatherData(data))
        .catch((error) => console.error("Error obteniendo clima:", error));
    }
  }, [coordinates]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const { data, error } = await client
        .from("spot_posts")
        .select("id, comment, image_url, created_at, profiles(nombre, apellidos, photo_url)")
        .eq("spot_id", spotId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error al obtener publicaciones recientes:", error.message);
      } else {
        setRecentPosts(data);
      }
    };
    

    if (spotId) {
      fetchRecentPosts();
    }
  }, [spotId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log("📥 handleUpload ejecutado");

    if (!session || !image || !comment) {
      console.log("❌ Faltan datos:", { session, image, comment });
      return;
    }

    try {
      setUploading(true);

      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${session.user.id}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      let { error: uploadError } = await client.storage
        .from("spot-posts")
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = client.storage
        .from("spot-posts")
        .getPublicUrl(filePath);

      console.log("✅ Datos de la publicación:", {
        spot_id: spot?.id,
        user_id: session?.user?.id,
        comment,
        image_url: publicUrl,
      });

      const { error: insertError } = await client
        .from("spot_posts")
        .insert({
          user_id: session.user.id,
          spot_id: spot.id,
          comment,
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      alert("¡Publicación subida con éxito!");
      setComment("");
      setImage(null);
    } catch (error) {
      console.error("❌ Error al subir la publicación:", error.message);
      alert("Error al subir la publicación");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-5">
          <p>Cargando spot...</p>
        </div>
      </>
    );
  }

  if (!spot) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-5">
          <h2>Spot no encontrado</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h1 className="display-4 mb-4">{spot.name}</h1>

            {spot.image_url && (
              <img
                src={spot.image_url}
                alt={spot.name}
                className="img-fluid rounded shadow-sm mb-4"
                style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
              />
            )}

            <h5 className="text-muted mb-3">{spot.Location}</h5>
            <p className="fs-5">{spot.Description}</p>

            <div className="mt-5 p-4 rounded shadow bg-light text-start">
              <h4 className="mb-4">Condiciones meteorológicas (última hora)</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>Altura de ola:</strong>{" "}
                  {weatherData?.waveHeight?.sg ?? "N/D"} m
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Periodo de ola:</strong>{" "}
                  {weatherData?.wavePeriod?.sg ?? "N/D"} s
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Dirección de ola:</strong>{" "}
                  {weatherData?.waveDirection?.sg ?? "N/D"}°
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Velocidad del viento:</strong>{" "}
                  {weatherData?.windSpeed?.sg ?? "N/D"} m/s
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Dirección del viento:</strong>{" "}
                  {weatherData?.windDirection?.sg ?? "N/D"}°
                </div>
              </div>
            </div>

            {/* Mini mapa */}
            {coordinates && (
              <div className="mt-5">
                <h4 className="mb-3">Ubicación en el mapa</h4>
                <LoadScriptNext googleMapsApiKey={'AIzaSyDoc4OW1DbayNM87H7QX5LGiwxouWZDzSw'}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={coordinates}
                    zoom={14}
                  >
                    <Marker
                      position={coordinates}
                      title={spot.name}
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
                          "_blank"
                        )
                      }
                    />
                  </GoogleMap>
                </LoadScriptNext>
              </div>
            )}
            <br/>
            <h2 className="mb-5 text-center">Actualizaciones de la zona realizadas por los usuarios</h2>
            {recentPosts.length > 0 ? (
              <div className="container">
                <h4 className="mb-4">Últimas publicaciones</h4>
                <div className="row g-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="col-md-4">
                      <div className="card h-100 shadow-sm">
                        <img
                          src={post.image_url}
                          alt="Publicación"
                          className="card-img-top"
                          onClick={() => setSelectedImage(post.image_url)}
                          style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                        />
                        <div className="card-body d-flex flex-column">
                          <p className="card-text flex-grow-1">{post.comment}</p>
                          <div className="d-flex align-items-center mt-3">
                            {post.profiles?.photo_url ? (
                              <img
                                src={post.profiles.photo_url}
                                alt="Foto de perfil"
                                className="rounded-circle me-2"
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-secondary me-2"
                                style={{ width: "40px", height: "40px" }}
                              />
                            )}
                            <div>
                              <small className="text-muted d-block">
                                {post.profiles?.nombre + " " + post.profiles?.apellidos || "Usuario anónimo"}
                              </small>
                              <small className="text-muted">
                                📅 {new Date(post.created_at).toLocaleString()}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-muted text-center">No hay publicaciones aún.</p>
            )}

            <Modal
              show={!!selectedImage}
              onHide={() => setSelectedImage(null)}
              centered
              size="lg"
            >
              <Modal.Header closeButton>
              </Modal.Header>
              <Modal.Body className="text-center bg-dark">
                <img
                  src={selectedImage}
                  alt="Vista ampliada"
                  className="img-fluid rounded"
                />
              </Modal.Body>
            </Modal>




            {/* Formulario para compartir estado del spot */}
            {session ? (
              <div className="mt-5 text-start">
                <h4 className="mb-3">Comparte el estado del spot</h4>
                <form onSubmit={handleUpload}>
                  <div className="mb-3">
                    <label className="form-label">Comentario</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? "Subiendo..." : "Publicar"}
                  </button>
                </form>
              </div>
            ) : (
              <p className="mt-5 text-muted">Inicia sesión para compartir información del spot.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SpotPage;
