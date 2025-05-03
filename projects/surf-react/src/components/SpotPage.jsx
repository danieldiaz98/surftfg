import React from "react";
import { useParams, useLocation } from "react-router-dom";

function SpotPage() {
    const { spotName } = useParams();
    const location = useLocation();
    const { imageUrl, location: spotLocation } = location.state || {};

    return (
        <div className="container mt-5">
            <div className="card">
                <img
                    src={imageUrl}
                    alt={spotName}
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body">
                    <h2 className="card-title">{decodeURIComponent(spotName)}</h2>
                    <p className="card-text">{spotLocation}</p>
                </div>
            </div>
        </div>
    );
}

export default SpotPage;
