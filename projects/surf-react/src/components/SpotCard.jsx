import React from 'react';

function SpotCard () {
    return (
        <div className="card" style={{ width: "18rem" }}>
            <img src="/lascanteras.jpg" className="card-img-top" alt="beach photo" />
            <div className="card-body">
                <h5 className="card-title">Card title</h5>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Nombre</li>
                <li className="list-group-item">Localización</li>
            </ul>
            <div className="card-body">
                <a href="#" className="card-link">Card link</a>
            </div>
        </div>
    )
}

export default SpotCard;