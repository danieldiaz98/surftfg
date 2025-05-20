import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function FollowStats({ followersCount, followingCount, userId }) {
  return (
    <Row className="text-center my-3">
      <Col>
        <Link
          to={`/Perfil/${userId}/seguidores`}
          className="text-decoration-none text-dark"
        >
          <strong>{followersCount}</strong><br />
          <small>Seguidores</small>
        </Link>
      </Col>
      <Col>
        <Link
          to={`/Perfil/${userId}/siguiendo`}
          className="text-decoration-none text-dark"
        >
          <strong>{followingCount}</strong><br />
          <small>Siguiendo</small>
        </Link>
      </Col>
    </Row>
  );
}

export default FollowStats;
