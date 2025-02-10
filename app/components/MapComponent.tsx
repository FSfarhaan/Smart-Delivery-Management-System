"use client"
import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet'; // No need for custom Icon import
import MarkerClusterGroup from 'react-leaflet-cluster'; // For clustering markers
import 'leaflet/dist/leaflet.css';

// Define your MapComponent accepting orders as a prop
const MapComponent = ({ orders }: { orders: any[] }) => {
  const [loadedOrders, setLoadedOrders] = useState(orders);

  useEffect(() => {
    setLoadedOrders(orders); // Update orders if they change
  }, [orders]);

  // Use useMemo to only recalculate filtered orders when necessary
  const validOrders = useMemo(() => {
    return loadedOrders.filter(order => order.coordinates?.lat && order.coordinates?.lng);
  }, [loadedOrders]);

  return (
    <MapContainer center={[34.0536909, -118.242766]} zoom={3} style={{ width: '100%', height: "15rem" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Add MarkerClusterGroup to group markers at the same location */}
      <MarkerClusterGroup>
        {validOrders.map((order) => (
          <Marker
            key={order.orderNumber}
            position={order.coordinates as LatLngExpression}
            icon={new Icon({
              iconUrl: "/leaflet/marker-icon.png", // Path to custom icon
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: "/leaflet/marker-shadow.png", // Path to custom shadow
              shadowSize: [41, 41],
            })}
          >
            <Popup>
              <div>
                <h3>{order.orderNumber}</h3>
                <p>{order.customer.name}</p>
                <p>{order.area}</p>
                <p>Status: {order.status}</p>
                <p>Total Amount: ${order.totalAmount}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
