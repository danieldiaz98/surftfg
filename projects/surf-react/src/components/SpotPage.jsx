import React from "react";
import { Link, useNavigate } from "react-router-dom";

function SpotPage({spotName}) {
    return (
        alert(spotName),
        <h2>You are in the {spotName} page</h2>
    );
}
export default SpotPage;