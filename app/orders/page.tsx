"use client";
import React, { useEffect, useState } from "react";
import PartnersTable from "@/app/components/PartnersTable";
import axios from "axios";
import Navbar from "../components/Navbar";
import PieChart from "@/app/components/PartnersPie";
import BarGraph from "@/app/components/BarGraph";
import OrderTable from "../components/OrderTable";
import dynamic from "next/dynamic";
import OrdersPieChart from "../components/StatusPie";
import MapComponent from "../components/MapComponent";
import FailedOrders from "../components/FailedOrders";
import { IOrder, OrdersArea } from "@/models/Order";
import { fetchOrders, getOrderAreas } from "../api/order";
import Sidebar from "../components/Sidebar";

export default function OrdersPage() {
  const [data, setData] = useState<{
    orders: IOrder[];
    area: OrdersArea[];
  } | null>(null);

  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchDatas = async () => {
      const ordersData = await fetchOrders();
      const areasData = await getOrderAreas();
      setData({ orders: ordersData, area: areasData });
    }
    fetchDatas();
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
  
    const method = isAdding ? "post" : "put";
    const url = isAdding
      ? "/api/orders"
      : `/api/orders/${editingOrder.orderNumber}`;
  
    // Ensure assignedTo is either a valid ID or null
    const { orderNumber, ...orderData } = {
      ...editingOrder,
      assignedTo: editingOrder.assignedTo || null,
    };
  
    try {
      const res = await axios({
        method,
        url,
        data: orderData,
        headers: { "Content-Type": "application/json" },
      });
  
      if (res.status === 200 || res.status === 201) {
        setData((prevData) =>
          prevData
            ? {
                ...prevData,
                orders: isAdding
                  ? [...prevData.orders, editingOrder] // Add new order
                  : prevData.orders.map((order) =>
                      order.orderNumber === editingOrder.orderNumber
                        ? editingOrder
                        : order
                    ), // Update existing order
              }
            : null
        );
  
        closeEditModal();
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  

  return (
    <div className="flex justify-between">
      <Sidebar pathname={"orders"}/>
      <div className="md:ml-64 w-full overflow-y-scroll md:overflow-y-hidden">
        <Navbar page="Orders" />

        <div className="flex justify-between md:mt-0 mt-16 md:flex-row flex-col">
          <main className="md:p-6 md:w-3/4 md:pt-0 md:pr-0 p-4">

            <div className="md:grid md:grid-cols-4 gap-4 mb-6 max-w-full overflow-x-auto flex-nowrap flex">
              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Orders Map</span>
                  <span className="text-sm text-green-500">+5%</span>
                </div>
                <div className="text-2xl font-bold">{data?.orders.length}</div>
                <div className="text-sm text-gray-500">+5 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Orders Delivered</span>
                  <span className="text-sm text-red-500">-1%</span>
                </div>
                <div className="text-2xl font-bold">
                  {
                    data?.orders.filter((order: any) => order.status === "delivered")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">-1 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Orders Pending</span>
                  <span className="text-sm text-green-500">+100%</span>
                </div>
                <div className="text-2xl font-bold">
                  {
                    data?.orders.filter((order: any) => order.status === "pending")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">
                  {data?.orders.filter((order: any) => order.status === "pending")
                    .length == 0
                    ? "Every Order is assigned"
                    : "+" +
                      data?.orders.filter((order: any) => order.status === "pending")
                        .length +
                      " since last month"}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Orders Assigned</span>
                  <span className="text-sm text-green-500">+3</span>
                </div>
                <div className="text-2xl font-bold">
                  {
                    data?.orders.filter((order: any) => order.status === "assigned")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">+3 than last month</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg shadow flex flex-col ">
                <div>
                  <h2 className="text-lg font-semibold">Total Orders</h2>
                  <h5 className="text-gray-500 md:text-sm text-xs mb-3">Here can be the seen the location of all orders.</h5>
                </div>
                <div className="flex-1" style={{zIndex: 1}}>
                  {data && <MapComponent orders={data?.orders} />}
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow bg-white p-4">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Total Orders</h2>
                  <h5 className="text-gray-500 md:text-sm text-xs mb-3">Here can be seen the complete list of orders.</h5>
                </div>
                <button
                  onClick={() => openEditModal(null)}
                  className="bg-green-500 text-white px-3 py-1 rounded mb-4 text-sm"
                >
                  Add Order
                </button>
              </div>
              <div className="w-full overflow-x-scroll md:overflow-x-hidden">
                <OrderTable orders={data?.orders || []} type="orders" openEditModal={openEditModal}/>
              </div>
            </div>
          </main>

          {/* Right section */}
          <div className="flex-1 h-screen gap-6 md:px-6 px-4 flex flex-col pb-24 md:pb-16">
            <FailedOrders />

            <div className="bg-white p-4 rounded-lg shadow">
              <OrdersPieChart />
            </div>
            {data && <BarGraph data={data?.area} type={"orders"} /> }
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
      </div>
    </div>
  );
}
