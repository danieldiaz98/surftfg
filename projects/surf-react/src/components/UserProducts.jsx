import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { Modal } from "react-bootstrap";

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
    const fetchProducts = async () => {
      const { data, error } = await client
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error) setProducts(data);
      else console.error("Error al obtener productos:", error.message);
    };

    if (userId) fetchProducts();
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
      const imageUrls = [];

      for (let image of images) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await client.storage
          .from("products-imgs")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data } = client.storage
          .from("products-imgs")
          .getPublicUrl(filePath);

        imageUrls.push(data.publicUrl);
      }

      const { error: insertError } = await client
        .from("products")
        .insert({
          user_id: userId,
          title,
          description,
          price: parseFloat(price),
          image_urls: imageUrls,
        });

      if (insertError) throw insertError;

      setNewProduct({ title: "", description: "", price: "", images: [] });
      const { data: updatedProducts } = await client
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error al subir producto:", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (productId, imageUrls) => {
    if (!window.confirm("¿Eliminar este producto?")) return;

    try {
      const paths = imageUrls.map((url) => url.split("/products-imgs/")[1]);

      const { error: deleteImageError } = await client.storage
        .from("products-imgs")
        .remove(paths);

      if (deleteImageError) throw deleteImageError;

      const { error: deleteDbError } = await client
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteDbError) throw deleteDbError;

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
    const { title, description, price } = editedProduct;

    try {
      const { error } = await client
        .from("products")
        .update({
          title,
          description,
          price: parseFloat(price),
        })
        .eq("id", productId);

      if (error) throw error;

      const { data: updatedProducts } = await client
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setProducts(updatedProducts);
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
