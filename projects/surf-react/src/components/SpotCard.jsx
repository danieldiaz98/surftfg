import React from 'react';

function SpotCard ({name, location, imageUrl}) {
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
                <a href="#" className="card-link">Card link</a>
            </div>
        </div>
    )
}

export default SpotCard;