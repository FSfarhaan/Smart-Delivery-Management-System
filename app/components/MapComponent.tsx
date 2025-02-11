"use client"
import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet'; // No need for custom Icon import
import MarkerCluster from 'react-leaflet-markercluster'; // For clustering markers
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { IOrder } from "@/models/Order";

export interface OrderWithCoord {
  orders: IOrder[],
  coordinates : {
    lat: number;
    lng: number;
  }
}
// Define your MapComponent accepting orders as a prop
const MapComponent = ({ orders }: { orders: IOrder[] }) => {
  const [loadedOrders, setLoadedOrders] = useState(orders);

  useEffect(() => {
    setLoadedOrders(orders); // Update orders if they change
  }, [orders]);

  // Use useMemo to only recalculate filtered orders when necessary
  const validOrders = useMemo(() => {
    return loadedOrders?.filter((order) => order.coordinates?.lat && order.coordinates?.lng);
  }, [loadedOrders]);

  return (
    <MapContainer center={[19.0760, 72.8777]} zoom={7} style={{ width: '100%', height: "15rem" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Add MarkerClusterGroup to group markers at the same location */}
      <MarkerCluster>
        {validOrders?.map((order) => (
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
      </MarkerCluster>
    </MapContainer>
  );
};

export default MapComponent;
