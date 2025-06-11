import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function OtherUsersProducts({ currentUserId }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOtherProducts = async () => {
      const { data, error } = await client
        .from("products")
        .select("*")
        .neq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener productos de otros usuarios:", error.message);
      } else {
        setProducts(data);
      }
    };

    fetchOtherProducts();
  }, [currentUserId]);

  const openImageModal = (images, index = 0) => {
    setModalImages(images);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setModalImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showImageModal) return;
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showImageModal, modalImages]);

  const filteredProducts = products.filter((product) =>
    (product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {filteredProducts.length === 0 ? (
        <p className="text-muted">No se encontraron productos con ese criterio.</p>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 d-flex flex-column">
                {product.image_urls?.length > 0 && (
                  <div className="d-flex overflow-auto gap-2 p-2">
                    {product.image_urls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Imagen ${idx + 1}`}
                        style={{
                          height: "140px",
                          width: "140px",
                          objectFit: "cover",
                          flexShrink: 0,
                          cursor: "pointer"
                        }}
                        className="rounded"
                        onClick={() => openImageModal(product.image_urls, idx)}
                      />
                    ))}
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="text-success fw-bold">${product.price}</p>
                  <small className="text-muted mb-2">
                    Publicado el {new Date(product.created_at).toLocaleDateString()}
                  </small>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/Perfil/${product.user_id}`)}
                    className="mt-auto"
                  >
                    Ver perfil del vendedor
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showImageModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton />
        <Modal.Body className="text-center position-relative">
          {modalImages.length > 0 && (
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX < rect.width / 2) handlePrevImage();
                else handleNextImage();
              }}
            >
              <img
                src={modalImages[currentImageIndex]}
                alt={`Imagen ${currentImageIndex + 1}`}
                style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
              />
              {modalImages.length > 1 && (
                <>
                  <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-white fs-2">←</div>
                  <div className="position-absolute top-50 end-0 translate-middle-y pe-3 text-white fs-2">→</div>
                </>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OtherUsersProducts;
