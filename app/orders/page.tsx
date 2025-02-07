"use client";
import { useOrderContext } from "@/context/OrderContext";
import { useState } from "react";

export default function OrdersPage() {
  const { orders, loading, fetchOrders } = useOrderContext();
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [area, setArea] = useState("");

  // ✅ Create New Order & Auto-Assign Partner
  const createOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        customer: { name: customerName, phone: customerPhone, address: customerAddress },
        area,
        items: [],
        totalAmount: 0,
      }),
    });

    if (res.ok) {
      fetchOrders(); // Refresh orders
      setOrderNumber("");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setArea("");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Add Order Form */}
      <div className="mb-6 flex gap-4">
        <input className="border p-2" placeholder="Order Number" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        <input className="border p-2" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <input className="border p-2" placeholder="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        <input className="border p-2" placeholder="Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
        <select className="border p-2" value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Select Area</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="San Francisco">San Francisco</option>
          <option value="Chicago">Chicago</option>
        </select>
        <button onClick={createOrder} className="bg-blue-500 text-white p-2 rounded">Add Order</button>
      </div>

      {/* Orders List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order Number</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Assigned Partner</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.map((order) => (
            <tr key={order._id} className="text-center">
              <td className="border p-2">{order.orderNumber}</td>
              <td className="border p-2">{order.customer.name}</td>
              <td className="border p-2">{order.assignedTo ? order.assignedTo : "Not Assigned"}</td>
              <td className="border p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
