import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../supabase/client";
import { Card, Spinner, ListGroup, Image, Button } from "react-bootstrap";

function FollowList() {
  const { id, type } = useParams();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      let query;
      if (type === "followers") {
        query = client
          .from("follows")
          .select("follower_id: follower(id, nombre, apellidos, photo_url)")
          .eq("followed_id", id);
      } else {
        query = client
          .from("follows")
          .select("followed_id: followed(id, nombre, apellidos, photo_url)")
          .eq("follower_id", id);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setUsers([]);
      } else {
        const extracted = data.map((item) =>
          type === "followers" ? item.follower_id : item.followed_id
        );
        setUsers(extracted);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [id, type]);

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{type === "followers" ? "Seguidores" : "Siguiendo"}</h4>
        {loading ? (
          <Spinner animation="border" />
        ) : users.length === 0 ? (
          <p>No hay usuarios para mostrar.</p>
        ) : (
          <ListGroup variant="flush">
            {users.map((user) => (
              <ListGroup.Item key={user.id} className="d-flex align-items-center">
                <Image
                  src={user.photo_url || "/default-avatar.png"}
                  roundedCircle
                  width={48}
                  height={48}
                  className="me-3"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <strong>{user.nombre} {user.apellidos}</strong>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </div>
  );
}

export default FollowList;