import React from "react";
import { useParams } from "react-router-dom";

function SpotPage() {
    const { spotName } = useParams();

    return (
        <h2>You are in the {decodeURIComponent(spotName)} page</h2>
    );
}

export default SpotPage;
