import { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import { followUser, unfollowUser, isFollowing } from "../supabase/followService";

function FollowButton({ profileUserId }) {
  const { session } = UserAuth();
  const currentUserId = session?.user?.id;

  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId || !profileUserId) return;

    const checkFollowStatus = async () => {
      try {
        const following = await isFollowing(currentUserId, profileUserId);
        setIsFollowed(following);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [currentUserId, profileUserId]);

  const handleClick = async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      if (isFollowed) {
        await unfollowUser(currentUserId, profileUserId);
        setIsFollowed(false);
      } else {
        await followUser(currentUserId, profileUserId);
        setIsFollowed(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  if (currentUserId === profileUserId) {
    return null;
  }

  return (
    <Button
      variant={isFollowed ? "outline-primary" : "primary"}
      onClick={handleClick}
      disabled={loading}
      size="sm"
    >
      {loading ? <Spinner animation="border" size="sm" /> : isFollowed ? "Siguiendo" : "Seguir"}
    </Button>
  );
}

export default FollowButton;
