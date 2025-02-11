import { IOrder } from "@/models/Order";
import axios from "axios";
import { Types } from "mongoose";

export interface orderProps {
  status: string;
  reason: string;
}

// ✅ Fetch all orders
export const fetchOrders = async () => {
  const response = await axios.get(`/api/orders`);
  return response.data;
};

export const fetchOrdersLoc = async () => {
  const response = await axios.get(`/api/orders/getOrdersLoc`);
  return response.data
}

// ✅ Create a new order
export const createOrder = async (orderData: IOrder) => {
  const response = await axios.post(`/api/orders`, orderData);
  return response.data;
};

// ✅ Update order status
export const updateOrder = async (id: Types.ObjectId, updateData: orderProps) => {
  const response = await axios.put(`/api/orders/${id}`, updateData);
  return response.data;
};

// ✅ Delete an order
export const deleteOrder = async (orderId: string) => {
  const response = await axios.delete(`/api/orders/${orderId}`);
  return response.data;
};

export const getOrderAreas = async () => {
  const response = await axios.get(`/api/orders/getAreas`);
  return response.data;
}