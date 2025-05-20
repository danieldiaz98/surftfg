import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { client } from "../supabase/client";
import { Spinner, ListGroup, Container } from "react-bootstrap";
import Navbar from "./Navbar";

function FollowList() {
  const { id } = useParams();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFollowers = location.pathname.includes("seguidores");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      let query;

      if (isFollowers) {
        query = client
          .from("follows")
          .select("follower_id(id, nombre, apellidos, photo_url)")
          .eq("followed_id", id);
      } else {
        query = client
          .from("follows")
          .select("followed_id(id, nombre, apellidos, photo_url)")
          .eq("follower_id", id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error al obtener la lista:", error.message);
        setUsers([]);
      } else {
        const mappedUsers = data.map((item) =>
          isFollowers ? item.follower_id : item.followed_id
        );
        setUsers(mappedUsers);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [id, isFollowers]);

  if (loading) return <Spinner animation="border" className="m-5" />;

  return (
    <>
        <Navbar />
        <Container className="mt-4">
        <h3 className="mb-4">{isFollowers ? "Seguidores" : "Siguiendo"}</h3>
        <ListGroup>
            {users.length === 0 ? (
            <div>No hay usuarios para mostrar.</div>
            ) : (
            users.map((user) => (
                <ListGroup.Item key={user.id}>
                <img
                    src={user.photo_url || "/default-avatar.png"}
                    alt="avatar"
                    width="40"
                    height="40"
                    className="rounded-circle me-2"
                />
                {user.nombre} {user.apellidos}
                </ListGroup.Item>
            ))
            )}
        </ListGroup>
        </Container>
    </>
  );
}

export default FollowList;
