"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import MarkerCluster from "react-leaflet-markercluster"; // Fixed import
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { IOrder } from "@/models/Order";

export interface OrderWithCoord {
  orders: IOrder[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

const MapComponent = ({ orders }: { orders: IOrder[] }) => {
  const [loadedOrders, setLoadedOrders] = useState(orders);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setLoadedOrders(orders);
  }, [orders]);

  // Use useMemo to filter orders only if `isClient` is true
  const validOrders = useMemo(() => {
    if (isClient) {
      return loadedOrders?.filter(
        (order) => order.coordinates?.lat && order.coordinates?.lng
      );
    }
    return []; // Return an empty array when `isClient` is false
  }, [loadedOrders, isClient]);

  if (!isClient) {
    return null; // Or a loading spinner, depending on your use case
  }

  return (
    <MapContainer
      center={[19.076, 72.8777]}
      zoom={7}
      style={{ width: "100%", height: "15rem" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <MarkerCluster>
        {validOrders?.map((order) => (
          <Marker
            key={order.orderNumber}
            position={order.coordinates as LatLngExpression}
            icon={
              new Icon({
                iconUrl: "/leaflet/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: "/leaflet/marker-shadow.png",
                shadowSize: [41, 41],
              })
            }
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

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
