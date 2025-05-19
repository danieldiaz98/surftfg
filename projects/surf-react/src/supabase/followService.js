import { client } from "../supabase/client";

export async function followUser(followerId, followedId) {
  if (followerId === followedId) {
    throw new Error("No puedes seguirte a ti mismo.");
  }

  const { data, error } = await client
    .from("follows")
    .insert([{ follower_id: followerId, followed_id: followedId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unfollowUser(followerId, followedId) {
  const { data, error } = await client
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("followed_id", followedId)
    .select();

  if (error) throw error;
  return data;
}

export async function isFollowing(followerId, followedId) {
  const { data, error } = await client
    .from("follows")
    .select("*")
    .eq("follower_id", followerId)
    .eq("followed_id", followedId)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
    throw error;
  }
  return !!data;
}

export async function getFollowers(userId) {
  const { data, error } = await client
    .from("follows")
    .select("follower_id")
    .eq("followed_id", userId);

  if (error) throw error;
  return data;
}


export async function getFollowing(userId) {
  const { data, error } = await client
    .from("follows")
    .select("followed_id")
    .eq("follower_id", userId);

  if (error) throw error;
  return data;
}
