import { Row, Col } from "react-bootstrap";

function FollowStats({ followersCount, followingCount }) {
  return (
    <Row className="text-center my-3">
      <Col>
        <strong>{followersCount}</strong><br />
        <small>Seguidores</small>
      </Col>
      <Col>
        <strong>{followingCount}</strong><br />
        <small>Siguiendo</small>
      </Col>
    </Row>
  );
}

export default FollowStats;