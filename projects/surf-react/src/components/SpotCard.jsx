import React from 'react';
import { Link, useNavigate } from "react-router-dom";

function SpotCard ({name, location, imageUrl}) {
    console.log(name);
    return (
        <div className="card" style={{ display: "inline-block", margin: "10px" }}>
            <img src={imageUrl} className="card-img-top" alt="beach photo" 
            style={{width: "auto", height: "300px"}}/>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">{location}</li>
            </ul>
            <div className="card-body">
            <Link to={`/${encodeURIComponent(name)}`} className="card-link">Card link</Link>
            </div>
        </div>
    )
}

export default SpotCard;