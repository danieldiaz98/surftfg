import { Row, Col, Card, Button, Modal, Image } from "react-bootstrap";

function Gallery({ photos, selectedPhoto, setSelectedPhoto, onDelete }) {
  return (
    <>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        {photos.length === 0 && (
          <p className="text-muted">No hay fotos en la galería.</p>
        )}
        <Row xs={2} md={3} className="g-3">
          {photos.map((photo) => (
            <Col key={photo.id}>
              <Card className="position-relative h-100">
                <Card.Img
                  variant="top"
                  src={photo.photo_url}
                  alt={`Foto subida el ${new Date(photo.uploaded_at).toLocaleDateString()}`}
                  style={{ height: "150px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setSelectedPhoto(photo.photo_url)}
                />
                {onDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-1"
                    onClick={() => onDelete(photo.id, photo.photo_url)}
                    aria-label="Eliminar foto"
                  >
                    &times;
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        show={!!selectedPhoto}
        onHide={() => setSelectedPhoto(null)}
        centered
        size="lg"
      >
        <Modal.Body className="p-0 text-center bg-dark">
          <Image
            src={selectedPhoto}
            alt="Foto ampliada"
            fluid
            style={{ maxHeight: "80vh", objectFit: "contain" }}
          />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setSelectedPhoto(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Gallery;
