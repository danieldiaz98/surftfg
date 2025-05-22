import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { client } from "../supabase/client";

function FollowButton({ targetUserId, currentUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const { data, error } = await client
        .from("follows")
        .select("id")
        .eq("follower_id", currentUserId)
        .eq("followed_id", targetUserId)
        .maybeSingle();

      if (!error && data) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    };

    if (targetUserId && currentUserId) {
      checkFollowStatus();
    }
  }, [targetUserId, currentUserId]);

  const toggleFollow = async () => {
    setLoading(true);

    if (isFollowing) {
      const { error } = await client
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("followed_id", targetUserId);

      if (!error) {
        setIsFollowing(false);
      }
    } else {
      const { error } = await client.from("follows").insert([
        {
          follower_id: currentUserId,
          followed_id: targetUserId,
        },
      ]);

      if (!error) {
        setIsFollowing(true);
      }
    }

    setLoading(false);
  };

  return (
    <Button
      variant={isFollowing ? "outline-danger" : "outline-primary"}
      onClick={toggleFollow}
      disabled={loading}
    >
      {loading ? "Cargando..." : isFollowing ? "Dejar de seguir" : "Seguir"}
    </Button>
  );
}

export default FollowButton;
