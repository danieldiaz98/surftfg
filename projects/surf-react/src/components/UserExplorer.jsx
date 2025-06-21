import { useEffect, useState, useRef, useCallback } from "react";
import { client } from "../supabase/client";
import { UserAuth } from "../context/AuthContext";
import { Spinner, Card, ListGroup, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function UserExplorer() {
  const { session } = UserAuth();
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  const USERS_PER_PAGE = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!hasMore) return;

      setLoading(true);
      try {
        const from = page * USERS_PER_PAGE;
        const to = from + USERS_PER_PAGE - 1;

        const { data: fetchedUsers, error: userError } = await client
          .from("profiles")
          .select("id, nombre, apellidos, photo_url")
          .range(from, to)
          .neq("id", session.user.id);

        if (userError) throw userError;

        if (fetchedUsers.length < USERS_PER_PAGE) {
          setHasMore(false);
        }

        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const newUsers = fetchedUsers.filter((u) => !existingIds.has(u.id));
          return [...prev, ...newUsers];
        });

        if (page === 0) {
          const { data: following, error: followError } = await client
            .from("follows")
            .select("followed_id")
            .eq("follower_id", session.user.id);

          if (followError) throw followError;
          setFollowingIds(following.map((f) => f.followed_id));
        }
      } catch (err) {
        console.error("Error cargando usuarios:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, session.user.id, hasMore]);

  const toggleFollow = async (targetUserId) => {
    const isFollowing = followingIds.includes(targetUserId);

    if (isFollowing) {
      const { error } = await client
        .from("follows")
        .delete()
        .eq("follower_id", session.user.id)
        .eq("followed_id", targetUserId);

      if (!error) {
        setFollowingIds(followingIds.filter((id) => id !== targetUserId));
      }
    } else {
      const { error } = await client.from("follows").insert({
        follower_id: session.user.id,
        followed_id: targetUserId,
      });

      if (!error) {
        setFollowingIds([...followingIds, targetUserId]);
      }
    }
  };

  const lastUserRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.nombre} ${user.apellidos}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Card className="shadow p-4">
          <h4 className="mb-3">Explorar usuarios</h4>

          <Form.Control
            type="text"
            placeholder="Buscar por nombre o apellidos"
            className="mb-4"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <ListGroup>
            {filteredUsers.length === 0 && !loading && (
              <div className="text-muted px-3 py-2">No se encontraron usuarios.</div>
            )}

            {filteredUsers.map((user, index) => {
              const isLast = index === filteredUsers.length - 1;

              return (
                <ListGroup.Item
                  key={user.id}
                  ref={isLast ? lastUserRef : null}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={user.photo_url || "/default-avatar.png"}
                      alt="avatar"
                      className="rounded-circle me-3"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                    <Link
                      to={`/Perfil/${user.id}`}
                      className="text-decoration-none text-dark"
                    >
                      {user.nombre} {user.apellidos}
                    </Link>
                  </div>
                  <Button
                    variant={
                      followingIds.includes(user.id)
                        ? "outline-danger"
                        : "outline-primary"
                    }
                    size="sm"
                    onClick={() => toggleFollow(user.id)}
                  >
                    {followingIds.includes(user.id)
                      ? "Dejar de seguir"
                      : "Seguir"}
                  </Button>
                </ListGroup.Item>
              );
            })}

            {loading && (
              <div className="text-center my-3">
                <Spinner animation="border" />
              </div>
            )}

            
          </ListGroup>
        </Card>
      </div>
    </>
  );
}

export default UserExplorer;
