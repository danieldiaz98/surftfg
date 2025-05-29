import { useEffect, useState } from "react";
import { client } from "../supabase/client";

function UserProducts({ userId, isOwnProfile }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [uploading, setUploading] = useState(false);

  // Fetch de productos
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

  // Subida de producto
  const handleProductUpload = async (e) => {
    e.preventDefault();

    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.image) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      setUploading(true);
      const fileExt = newProduct.image.name.split(".").pop();
      const fileName = `${Date.now()}-${userId}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await client.storage
        .from("products-imgs")
        .upload(filePath, newProduct.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = client.storage
        .from("products-imgs")
        .getPublicUrl(filePath);

      const { error: insertError } = await client
        .from("products")
        .insert({
          user_id: userId,
          title: newProduct.title,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      setNewProduct({ title: "", description: "", price: "", image: null });
      alert("Producto publicado exitosamente.");

      // Refetch
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

  // Eliminar producto
  const handleDelete = async (productId, imageUrl) => {
    const confirm = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
    if (!confirm) return;

    try {
      const filePath = imageUrl.split("/products-imgs/")[1];

      const { error: deleteImageError } = await client.storage
        .from("products-imgs")
        .remove([filePath]);

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
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
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
                <img
                  src={product.image_url}
                  className="card-img-top"
                  alt={product.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="text-success fw-bold">{product.price}€</p>
                  <small className="text-muted mt-auto">
                    Publicado el {new Date(product.created_at).toLocaleDateString()}
                  </small>
                  {isOwnProfile && (
                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => handleDelete(product.id, product.image_url)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No hay productos publicados.</p>
        )}
      </div>
    </div>
  );
}

export default UserProducts;
