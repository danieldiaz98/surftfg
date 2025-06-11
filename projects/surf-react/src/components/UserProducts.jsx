import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  fetchUserProducts,
  uploadProductImages,
  insertProduct,
  deleteProduct,
  updateProduct,
} from "../supabase/userProductServices";

function UserProducts({ userId, isOwnProfile }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [uploading, setUploading] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const data = await fetchUserProducts(userId);
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error.message);
      }
    };

    load();
  }, [userId]);

  const handleProductUpload = async (e) => {
    e.preventDefault();
    const { title, description, price, images } = newProduct;

    if (!title || !description || !price || images.length === 0) {
      alert("Completa todos los campos e incluye al menos una imagen.");
      return;
    }

    if (images.length > 3) {
      alert("Solo se permiten hasta 3 imágenes por producto.");
      return;
    }

    try {
      setUploading(true);
      const imageUrls = await uploadProductImages(images);
      await insertProduct({ userId, title, description, price, image_urls: imageUrls });

      const updated = await fetchUserProducts(userId);
      setProducts(updated);
      setNewProduct({ title: "", description: "", price: "", images: [] });
    } catch (error) {
      console.error("Error al subir producto:", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (productId, imageUrls) => {
    if (!window.confirm("¿Eliminar este producto?")) return;

    try {
      await deleteProduct(productId, imageUrls);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditedProduct({
      title: product.title,
      description: product.description,
      price: product.price,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedProduct({});
  };

  const saveEditedProduct = async (productId) => {
    try {
      await updateProduct(productId, editedProduct);
      const updated = await fetchUserProducts(userId);
      setProducts(updated);
      cancelEditing();
    } catch (error) {
      console.error("Error al editar producto:", error.message);
    }
  };

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

  return (
    <div className="mt-5">
      {isOwnProfile && (
        <>
          <h4 className="mb-3">Publicar producto en venta</h4>
          <form onSubmit={handleProductUpload} className="mb-5">
            <input
              type="text"
              placeholder="Título"
              className="form-control mb-2"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            />
            <textarea
              placeholder="Descripción"
              className="form-control mb-2"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Precio"
              className="form-control mb-2"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              multiple
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files).slice(0, 3);
                setNewProduct({ ...newProduct, images: selectedFiles });
              }}
            />
            <button className="btn btn-primary" type="submit" disabled={uploading}>
              {uploading ? "Publicando..." : "Publicar producto"}
            </button>
          </form>
        </>
      )}

      <h4 className="mb-3">{isOwnProfile ? "Mis productos en venta" : "Productos en venta"}</h4>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {product.image_urls?.length > 0 && (
                  <div className="d-flex overflow-auto gap-2 p-2">
                    {product.image_urls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Imagen ${idx + 1}`}
                        style={{ height: "140px", width: "140px", objectFit: "cover", flexShrink: 0 }}
                        className="rounded"
                        onClick={() => openImageModal(product.image_urls, idx)}
                      />
                    ))}
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  {editingId === product.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editedProduct.title}
                        onChange={(e) => setEditedProduct({ ...editedProduct, title: e.target.value })}
                      />
                      <textarea
                        className="form-control mb-2"
                        value={editedProduct.description}
                        onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                      />
                      <input
                        type="number"
                        className="form-control mb-2"
                        value={editedProduct.price}
                        onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                      />
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => saveEditedProduct(product.id)}>
                          Guardar
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h5 className="card-title">{product.title}</h5>
                      <p className="card-text">{product.description}</p>
                      <p className="text-success fw-bold">${product.price}</p>
                      <small className="text-muted mt-auto">
                        Publicado el {new Date(product.created_at).toLocaleDateString()}
                      </small>
                      {isOwnProfile && (
                        <div className="d-flex gap-2 mt-2">
                          <button className="btn btn-warning btn-sm" onClick={() => startEditing(product)}>
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(product.id, product.image_urls)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No hay productos publicados.</p>
        )}
      </div>

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
    </div>
  );
}

export default UserProducts;
