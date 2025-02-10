"use client";
import React, { useEffect, useState } from "react";
import PartnersTable from "@/app/components/PartnersTable";
import axios from "axios";
import Navbar from "../components/Navbar";
import PieChart from "@/app/components/PieChart";
import BarGraph from "@/app/components/BarGraph";
import OrderTable from "../components/OrderTable";
import dynamic from "next/dynamic";
import OrdersPieChart from "../components/OrderStatusPie";
import MapComponent from "../components/MapComponent";
import FailedOrders from "../components/FailedOrders";
import { IOrder } from "@/models/Order";

export default function OrdersPage() {
  const [data, setData] = useState<{
    orders: IOrder[];
    metrics: any;
  } | null>(null);

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [areas, setAreas] = useState([]);
  const [failureCount, setFailureCount] = useState<number>(0);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const res = await axios.get<IOrder[]>("/api/orders");
        const orders = res.data;
        setOrders(orders); // Save partners in state
      } catch (err) {
        console.log(
          err instanceof Error ? err.message : "Failed to fetch orders"
        );
      }
    };
    const fetchAreaData = async () => {
      try {
        const res = await axios.get("/api/orders/getAreas");
        const orders = res.data;
        setAreas(orders);
        console.log(orders);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAreaData();
    fetchOrdersData();
  }, []);

  const openEditModal = (order: IOrder | null) => {
    if (order) {
      setEditingOrder({ ...order });
      setIsAdding(false);
    } else {
      setEditingOrder({
        orderNumber: "",
        customer: { name: "", phone: "", address: "" },
        area: "",
        items: [{ name: "", quantity: 0, price: 0 }], // Corrected items to match IOrder type
        status: "pending", // Default status set to 'pending'
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsAdding(true);
    }
  };

  const closeEditModal = () => {
    setEditingOrder(null);
    setIsAdding(false);
  };

  const saveOrder = async () => {
    if (!editingOrder) return;
  
    const method = isAdding ? "POST" : "PUT";
    const url = isAdding
      ? "/api/orders"
      : `/api/orders/${editingOrder.orderNumber}`;
  
    // Ensure assignedTo is either a valid ID or null
    const orderData = {
      ...editingOrder,
      assignedTo: editingOrder.assignedTo || null,
    };
  
    console.log(orderData, method);
  
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
  
    if (res.ok) {
      if (isAdding) {
        setOrders([...orders, { ...editingOrder }]);
      } else {
        setOrders(
          orders.map((order) =>
            order.orderNumber === editingOrder.orderNumber ? editingOrder : order
          )
        );
      }
      closeEditModal();
    } else {
      console.error("Error saving order", await res.json());
    }
  };

  return (
    <>
      <Navbar page="Orders Page" />

      <div className="flex justify-between">

        <main className="p-6 pt-0 pr-0 w-3/4">

          <div className="grid grid-cols-4 gap-4 mb-6 ">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Orders Map</span>
                <span className="text-sm text-green-500">+5%</span>
              </div>
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-gray-500">+5 than last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Orders Delivered</span>
                <span className="text-sm text-red-500">-1%</span>
              </div>
              <div className="text-2xl font-bold">
                {
                  orders.filter((order: any) => order.status === "delivered")
                    .length
                }
              </div>
              <div className="text-sm text-gray-500">-1 than last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Orders Pending</span>
                <span className="text-sm text-green-500">100%</span>
              </div>
              <div className="text-2xl font-bold">
                {
                  orders.filter((order: any) => order.status === "pending")
                    .length
                }
              </div>
              <div className="text-sm text-gray-500">
                {orders.filter((order: any) => order.status === "pending")
                  .length == 0
                  ? "Every Order is assigned"
                  : "+" +
                    orders.filter((order: any) => order.status === "pending")
                      .length +
                    " since last month"}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Orders Assigned</span>
                <span className="text-sm text-green-500">+3</span>
              </div>
              <div className="text-2xl font-bold">
                {
                  orders.filter((order: any) => order.status === "assigned")
                    .length
                }
              </div>
              <div className="text-sm text-gray-500">+3 than last month</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex flex-col ">
              <div className="h-8 flex justify-between">
                <h2 className="text-lg font-semibold">Total Orders</h2>
              </div>
              {/* Add your preferred charting library here */}
              <div className="flex-1" style={{zIndex: 1}}>
                <MapComponent orders={orders} />
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow bg-white p-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">Total Orders</h2>
              <button
                onClick={() => openEditModal(null)}
                className="bg-green-500 text-white px-3 py-1 rounded mb-4"
              >
                Add Order
              </button>
            </div>
            <OrderTable orders={orders || []} type="orders" openEditModal={openEditModal}/>
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="w-1/4 h-screen gap-6 px-6 flex flex-col">
          <FailedOrders />

          <div className="bg-white p-4 rounded-lg shadow">
            <OrdersPieChart />
          </div>
          <BarGraph data={areas} type={"orders"} />
        </div>
      </div>

      {editingOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isAdding ? "Add Order" : "Edit Order"}
            </h2>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Order number"
              value={editingOrder.orderNumber}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  orderNumber: e.target.value
                })
              }
            />

            {/* Customer Details */}
            <input
              className="border p-2 w-full mb-2"
              placeholder="Customer Name"
              value={""}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  customer: { ...editingOrder.customer, name: e.target.value },
                })
              }
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Customer Phone"
              value={editingOrder.customer.phone}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  customer: { ...editingOrder.customer, phone: e.target.value },
                })
              }
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Customer Address"
              value={editingOrder.customer.address}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  customer: {
                    ...editingOrder.customer,
                    address: e.target.value,
                  },
                })
              }
            />

            {/* Area */}
            <input
              className="border p-2 w-full mb-2"
              placeholder="Area"
              value={editingOrder.area}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  area: e.target.value,
                })
              }
            />

            {/* Order Status */}
            <select
              className="border p-2 w-full mb-2"
              value={editingOrder.status}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  status: e.target.value as IOrder["status"],
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked">Picked</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>

            {/* Assigned Partner */}
            <input
              className="border p-2 w-full mb-2"
              placeholder="Assigned To (Partner ID)"
              value={editingOrder.assignedTo || ""}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  assignedTo: e.target.value || undefined, // Set undefined if empty
                })
              }
            />

            {/* Items */}
            <h3 className="text-lg font-semibold mt-4">Order Items</h3>
            {editingOrder.items.map((item, index) => (
              <div key={index} className="mb-2">
                <input
                  className="border p-2 w-full mb-1"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...editingOrder.items];
                    newItems[index].name = e.target.value;
                    setEditingOrder({ ...editingOrder, items: newItems });
                  }}
                />
                <input
                  type="number"
                  className="border p-2 w-full mb-1"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...editingOrder.items];
                    newItems[index].quantity = Number(e.target.value);
                    setEditingOrder({ ...editingOrder, items: newItems });
                  }}
                />
                <input
                  type="number"
                  className="border p-2 w-full"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...editingOrder.items];
                    newItems[index].price = Number(e.target.value);
                    setEditingOrder({ ...editingOrder, items: newItems });
                  }}
                />
              </div>
            ))}
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded w-full mb-2"
              onClick={() =>
                setEditingOrder({
                  ...editingOrder,
                  items: [
                    ...editingOrder.items,
                    { name: "", quantity: 1, price: 0 },
                  ],
                })
              }
            >
              Add Item
            </button>

            {/* Total Amount */}
            <input
              type="number"
              className="border p-2 w-full mb-2"
              placeholder="Total Amount"
              value={editingOrder.totalAmount}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  totalAmount: Number(e.target.value),
                })
              }
            />

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={closeEditModal}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveOrder}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
