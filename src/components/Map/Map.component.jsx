import React from 'react'

import { TileLayer } from "react-leaflet";
import { MapContainer as LeafletMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './Map.styles.css';

function Map({center, zoom}) {
    return (
        <div className="map">
            <LeafletMap
                center={center}
                zoom={zoom}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </LeafletMap>
        </div>
    );
}

export default Map