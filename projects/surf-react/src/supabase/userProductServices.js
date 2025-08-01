import { client } from "../supabase/client";

export const fetchUserProducts = async (userId) => {
  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const uploadProductImages = async (images) => {
  const urls = [];

  for (let image of images) {
    const ext = image.name.split(".").pop();
    const name = `${Date.now()}-${Math.random()}.${ext}`;
    const path = `products/${name}`;

    const { error: uploadError } = await client.storage
      .from("products-imgs")
      .upload(path, image);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = client.storage
      .from("products-imgs")
      .getPublicUrl(path);

    urls.push(data.publicUrl);
  }

  return urls;
};

export const insertProduct = async ({ userId, title, description, price, image_urls }) => {
  const { error } = await client
    .from("products")
    .insert({
      user_id: userId,
      title,
      description,
      price: parseFloat(price),
      image_urls,
    });

  if (error) throw new Error(error.message);
};

export const deleteProduct = async (productId, imageUrls) => {
  const paths = imageUrls.map((url) => url.split("/products-imgs/")[1]);

  const { error: deleteImageError } = await client.storage
    .from("products-imgs")
    .remove(paths);

  if (deleteImageError) throw new Error(deleteImageError.message);

  const { error: deleteDbError } = await client
    .from("products")
    .delete()
    .eq("id", productId);

  if (deleteDbError) throw new Error(deleteDbError.message);
};

export const updateProduct = async (productId, { title, description, price }) => {
  const { error } = await client
    .from("products")
    .update({
      title,
      description,
      price: parseFloat(price),
    })
    .eq("id", productId);

  if (error) throw new Error(error.message);
};

export const fetchAllProductsExceptUser = async (userId) => {
  const res = await fetch(`/api/products?excludeUserId=${userId}`);
  if (!res.ok) throw new Error("No se pudieron obtener los productos de otros usuarios");
  return await res.json();
};