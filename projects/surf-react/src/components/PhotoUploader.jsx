import { Button } from "react-bootstrap";

function PhotoUploader({ uploading, fileInputRef, onUpload }) {
  return (
    <div className="d-flex justify-content-end mb-3 w-100" style={{ maxWidth: "600px" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        style={{ display: "none" }}
        accept="image/*"
      />
      <Button
        variant="outline-success"
        size="sm"
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
      >
        {uploading ? "Subiendo..." : "Añadir Foto"}
      </Button>
    </div>
  );
}

export default PhotoUploader;
