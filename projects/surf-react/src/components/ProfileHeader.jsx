import { Card, Image, Button } from "react-bootstrap";

function ProfileHeader({ perfil, loading, fileInputRef, onUpload, email }) {
  return (
    <>
      <div className="mb-3 position-relative d-inline-block">
        <Image
          src={perfil.photo_url || "/default-avatar.png"}
          alt="Foto de perfil"
          roundedCircle
          style={{ width: "140px", height: "140px", objectFit: "cover", border: "4px solid #007bff" }}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={onUpload}
          style={{ display: "none" }}
          accept="image/*"
        />
        <Button
          variant="outline-primary"
          size="sm"
          className="position-absolute bottom-0 end-0"
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Cambiar"}
        </Button>
      </div>

      <h3>{perfil.nombre} {perfil.apellidos}</h3>
      <p className="text-muted">{email}</p>
      <p>{perfil.description}</p>
    </>
  );
}

export default ProfileHeader;
