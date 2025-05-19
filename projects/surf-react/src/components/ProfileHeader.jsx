import { Image, Button } from "react-bootstrap";
import FollowButton from "./FollowButton";

function ProfileHeader({ perfil, loading, fileInputRef, onUpload, email, profileId, currentUserId }) {
  const isOwnProfile = profileId === currentUserId;

  return (
    <div className="mb-4">
      {/* Imagen + botón (alineados a la izquierda) */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <Image
          src={perfil.photo_url || "/default-avatar.png"}
          alt="Foto de perfil"
          roundedCircle
          style={{
            width: "140px",
            height: "140px",
            objectFit: "cover",
            border: "4px solid #007bff"
          }}
        />
        {isOwnProfile && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onUpload}
              style={{ display: "none" }}
              accept="image/*"
            />
            <Button
              variant="outline-primary"
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
            >
              {loading ? "Subiendo..." : "Cambiar"}
            </Button>
          </>
        )}
      </div>

      {/* Nombre + botón de seguir */}
      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
        <h3 className="mb-0">
          {perfil.nombre} {perfil.apellidos}
        </h3>
        {!isOwnProfile && (
          <FollowButton targetUserId={profileId} currentUserId={currentUserId} />
        )}
      </div>

      <p className="text-muted mb-0">{email}</p>
    </div>
  );
}

export default ProfileHeader;
