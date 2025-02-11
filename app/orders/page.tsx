"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BarGraph from "@/app/components/BarGraph";
import OrderTable from "../components/OrderTable";
import OrdersPieChart from "../components/StatusPie";
import MapComponent from "../components/MapComponent";
import FailedOrders from "../components/FailedOrders";
import { IOrder, OrdersArea } from "@/models/Order";
import { fetchOrders, getOrderAreas, orderProps, updateOrder } from "../api/order";
import Sidebar from "../components/Sidebar";
import { IPartner } from "@/models/Partner";
import { fetchPartners } from "../api/partner";
import { Types } from "mongoose";
import PartnersTable from "../components/PartnersTable";

interface FilterOptions {
  status: string[];
  areas: string[];
  date: string;
}

export default function OrdersPage() {
  const [data, setData] = useState<{
    orders: IOrder[];
    area: OrdersArea[];
  } | null>(null);

  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<IOrder[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    areas: [],
    date: "",
  });

  const [assignModal, setAssignModal] = useState(false);
  const [markAsModal, setMarkAsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Types.ObjectId>();
  const [partners, setPartners] = useState<IPartner[]>();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [failureReason, setFailureReason] = useState("");

  const saveStatus = () => {
    if (selectedStatus === "failed" && !failureReason) {
      alert("Please provide a failure reason.");
      return;
    }

    if(selectedStatus) {
      const updateData: orderProps = {
        status: selectedStatus,
        reason: selectedStatus === "failed" ? failureReason : "undefined", // Only add reason if status is "failed"
      };
      
    // Ensure you are passing the orderNumber, not orderId
    if (!selectedOrder) return;
    console.log(selectedOrder);
    updateOrder(selectedOrder, updateData)
      .then((updatedOrder) => {
        let updatedOrders;
        setData((prevData) => {
          if (!prevData) return prevData; // if no data is present, return the same

          // Find the updated order and replace it with the updated one
          updatedOrders = prevData.orders.map((order) =>
            order.orderNumber === updatedOrder.orderNumber
              ? updatedOrder
              : order
          );

          // Return the updated state
          return {
            ...prevData,
            orders: updatedOrders,
          };
        });

        if (updatedOrders) setFilteredData(updatedOrders);

        setMarkAsModal(false);
      })
      .catch((error) => {
        console.error("Error updating order:", error);
        // Handle error if needed
      });

    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (status !== "failed") {
      setFailureReason(""); // Reset failure reason when status is not "failed"
    }
  };

  useEffect(() => {
    const fetchDatas = async () => {
      const ordersData = await fetchOrders();
      const areasData = await getOrderAreas();
      setData({ orders: ordersData, area: areasData });
      setFilteredData(ordersData);
    };
    fetchDatas();
  }, []);

  const openEditModal = (order: IOrder | null) => {
    if (order) {
      setEditingOrder({ ...order });
      setIsAdding(false);
    } else {
      setEditingOrder({
        _id: null,
        orderNumber: "",
        customer: { name: "", phone: "", address: "" },
        area: "",
        items: [{ name: "", quantity: 0, price: 0 }],
        status: "pending",
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        coordinates: { lat: 0, lng: 0}
      });
      setIsAdding(true);
    }
  };

  const openAssignModal = (order: Types.ObjectId) => {
    setAssignModal(!assignModal);
    setSelectedOrder(order);
    fetchPartners().then(setPartners);
  };

  const closeAssignModal = () => {
    setAssignModal(false);
  };

  const openMarkModal = (order: Types.ObjectId) => {
    setMarkAsModal(!markAsModal);
    setSelectedOrder(order);

    localStorage.removeItem("selectedOrder");
    localStorage.setItem("selectedOrder", order.toString());
  };

  const closeEditModal = () => {
    setEditingOrder(null);
    setIsAdding(false);
    setAssignModal(false);
  };

  const saveOrder = async () => {
    if (!editingOrder) return;

    const method = isAdding ? "post" : "put";
    const url = isAdding
      ? "/api/orders"
      : `/api/orders/${editingOrder.orderNumber}`;

    const { _id, ...orderData } = {
      ...editingOrder,
      assignedTo: editingOrder.assignedTo || null,
    };

    console.log(_id);

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
                  ? [...prevData.orders, editingOrder]
                  : prevData.orders.map((order) =>
                      order.orderNumber === editingOrder.orderNumber
                        ? editingOrder
                        : order
                    ),
              }
            : null
        );

        closeEditModal();
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const openFilterModal = () => {
    setIsFilterOpen(true);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prevFilters) => {
      const prevValue = Array.isArray(prevFilters[key]) ? prevFilters[key] : [];
      const updatedValues = prevValue.includes(value)
        ? prevValue.filter((v) => v !== value) // Remove if already selected
        : [...prevValue, value]; // Add if not selected

      return { ...prevFilters, [key]: updatedValues };
    });
  };

  const applyFilters = () => {
    if (!data) return;

    // Always start filtering from the original orders list
    let filtered = [...data.orders];

    if (filters.status.length > 0) {
      filtered = filtered.filter((order) =>
        filters.status.includes(order.status)
      );
    }

    if (filters.areas.length > 0) {
      filtered = filtered.filter((order) => filters.areas.includes(order.area));
    }

    if (filters.date) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.createdAt).toISOString().split("T")[0] === filters.date
      );
    }

    // Update the filtered data
    setFilteredData(filtered);
    console.log(data.orders);
    console.log(filteredData);
  };

  return (
    <div className="flex justify-between">
      <Sidebar pathname={"orders"} />
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
                    data?.orders.filter(
                      (order: IOrder) => order.status === "delivered"
                    ).length
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
                    data?.orders.filter(
                      (order: IOrder) => order.status === "pending"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-500">
                  {data?.orders.filter(
                    (order: IOrder) => order.status === "pending"
                  ).length == 0
                    ? "Every Order is assigned"
                    : "+" +
                      data?.orders.filter(
                        (order: IOrder) => order.status === "pending"
                      ).length +
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
                    data?.orders.filter(
                      (order: IOrder) => order.status === "assigned"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-500">+3 than last month</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg shadow flex flex-col ">
                <div>
                  <h2 className="text-lg font-semibold">Total Orders</h2>
                  <h5 className="text-gray-500 md:text-sm text-xs mb-3">
                    Here can be the seen the location of all orders.
                  </h5>
                </div>
                <div className="flex-1" style={{ zIndex: 1 }}>
                  {data && <MapComponent orders={data?.orders} />}
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow bg-white p-4">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Total Orders</h2>
                  <h5 className="text-gray-500 md:text-sm text-xs mb-3">
                    Here can be seen the complete list of orders.
                  </h5>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => openEditModal(null)}
                    className="bg-green-500 text-white px-3 py-1 rounded mb-4 text-sm"
                  >
                    Add Order
                  </button>

                  <button
                    onClick={openFilterModal}
                    className="bg-green-500 text-white px-3 py-1 rounded mb-4 text-sm"
                  >
                    Filters
                  </button>
                </div>
              </div>
              <div className="w-full overflow-x-scroll md:overflow-x-hidden">
                <OrderTable
                  orders={filteredData || []}
                  openAssignModal={openAssignModal}
                  openMarkModal={openMarkModal}
                />
              </div>
            </div>
          </main>

          {/* Right section */}
          <div className="flex-1 gap-6 md:px-6 px-4 flex flex-col pb-24 md:pb-16">
            <FailedOrders />

            <div className="bg-white p-4 rounded-lg shadow">
              <OrdersPieChart />
            </div>
            {data && <BarGraph data={data?.area} type={"orders"} />}
          </div>
        </div>

        {editingOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-lg overflow-scroll md:h-auto md:w-auto md:overflow-hidden w-[80vw] h-[50vh]">
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
                    orderNumber: e.target.value,
                  })
                }
              />

              {/* Customer Details */}
              <input
                className="border p-2 w-full mb-2"
                placeholder="Customer Name"
                value={editingOrder.customer.name}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    customer: {
                      ...editingOrder.customer,
                      name: e.target.value,
                    },
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
                    customer: {
                      ...editingOrder.customer,
                      phone: e.target.value,
                    },
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
                    value={item.quantity == 0 ? "" : item.quantity}
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
                    value={item.price == 0 ? "" : item.price}
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
                value={editingOrder.totalAmount == 0 ? "" : editingOrder.totalAmount}
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

        {/* Filter Modal */}
        {isFilterOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-scroll md:h-auto md:w-auto md:overflow-hidden w-[80vw] h-[50vh]">
              <h2 className="text-lg font-semibold mb-4">Filter Orders</h2>

              {/* Status Filter */}
              <div className="mb-4">
                <h3 className="font-medium">Status:</h3>
                {["delivered", "assigned", "pending", "failed"].map(
                  (status) => (
                    <label key={status} className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => handleFilterChange("status", status)}
                      />
                      <span className="ml-2">{status}</span>
                    </label>
                  )
                )}
              </div>

              {/* Area Filter */}
              <div className="mb-4">
                <h3 className="font-medium">Areas:</h3>
                {data?.area.map(({ area }) => (
                  <label key={area} className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={filters.areas.includes(area)}
                      onChange={() => handleFilterChange("areas", area)}
                    />
                    <span className="ml-2">{area}</span>
                  </label>
                ))}
              </div>

              {/* Date Filter */}
              <div className="mb-4">
                <h3 className="font-medium">Date:</h3>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    applyFilters();
                    setIsFilterOpen(false); // Close modal after applying filters
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {markAsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-scroll md:h-auto md:w-auto md:overflow-hidden w-[80vw] h-[50vh]">
              <h2 className="text-lg font-semibold mb-4">Mark Order</h2>

              {/* Order Status Filter */}
              <div className="mb-4">
                <h3 className="font-medium">Status:</h3>
                {["delivered", "pending", "failed"].map((status) => (
                  <label key={status} className="flex items-center mt-2">
                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === status}
                      onChange={() => handleStatusChange(status)}
                    />
                    <span className="ml-2">{status}</span>
                  </label>
                ))}
              </div>

              {/* Failure Reason (only visible if "failed" is selected) */}
              {selectedStatus === "failed" && (
                <div className="mb-4">
                  <h3 className="font-medium">Failure Reason:</h3>
                  <textarea
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    placeholder="Enter failure reason"
                    className="border p-2 rounded w-full"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    saveStatus();
                    setMarkAsModal(false); // Close modal after saving
                  }}
                  disabled={
                    !selectedStatus ||
                    (selectedStatus === "failed" && !failureReason)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Save
                </button>
                <button
                  onClick={() => setMarkAsModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {assignModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="overflow-scroll md:h-auto md:w-auto md:overflow-hidden w-[80vw] h-[50vh]">
                {partners && (
                  <PartnersTable
                    couriers={partners}
                    openEditModal={() => {}}
                    showMinified={true}
                    closeAssignModal={closeAssignModal}
                  />
                )}

                <button
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
