import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.162.209:3000";

// ✅ Fetch all orders
export const fetchOrders = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/orders`);
  return response.data;
};

export const fetchOrdersLoc = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/orders/getOrdersLoc`);
  return response.data
}

// ✅ Create a new order
export const createOrder = async (orderData: any) => {
  const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
  return response.data;
};

// ✅ Update order status
export const updateOrder = async (orderId: string, updateData: any) => {
  const response = await axios.put(`${API_BASE_URL}/api/orders/${orderId}`, updateData);
  return response.data;
};

// ✅ Delete an order
export const deleteOrder = async (orderId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`);
  return response.data;
};

export const getOrderAreas = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/orders/getAreas`);
  return response.data;
}
