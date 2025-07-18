import { client } from "../supabase/client";
import getCoordinatesFromPlaceNameGoogle from "../SpotInfo/Location";
import getWeatherData from "../SpotInfo/Weather";

export async function fetchSpotById(spotId) {
  const { data, error } = await client
    .from("spots")
    .select("*")
    .eq("id", spotId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchCoordinates(spot) {
  const fullPlaceName = `${spot.name}, ${spot.Location}`;
  return await getCoordinatesFromPlaceNameGoogle(fullPlaceName);
}

export async function fetchWeather(lat, lng) {
  return await getWeatherData(lat, lng);
}

export async function fetchRecentSpotPosts(spotId) {
  const { data, error } = await client
    .from("spot_posts")
    .select("id, comment, image_url, created_at, profiles(nombre, apellidos, photo_url)")
    .eq("spot_id", spotId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function uploadSpotPost({ session, spot, comment, image }) {
  const fileExt = image.name.split(".").pop();
  const fileName = `${Date.now()}-${session.user.id}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  let { error: uploadError } = await client.storage
    .from("spot-posts")
    .upload(filePath, image);

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = client.storage
    .from("spot-posts")
    .getPublicUrl(filePath);

  const { error: insertError } = await client.from("spot_posts").insert({
    user_id: session.user.id,
    spot_id: spot.id,
    comment,
    image_url: publicUrl,
  });

  if (insertError) throw new Error(insertError.message);

  return true;
}
