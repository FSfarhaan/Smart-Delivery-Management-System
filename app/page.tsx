"use client";

import { FC, useState, useEffect } from "react";
import { fetchOrdersLoc } from "./api/order";
import PieChart from "@/app/components/PieChart";
import Navbar from "./components/Navbar";
import OrdersPieChart from "./components/OrderStatusPie";
import AssignmentTable from "./components/AssignmentTable";
import MapComponent from "./components/MapComponent";

const Dashboard: FC = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);

  useEffect(() => {
    fetchOrdersLoc()
      .then((data: any) => {
        setOrders(data);
        const totalAmount = data.reduce((total: number, order: any) => total + order.totalAmount, 0);
        const filteredArr = data.filter((da: any) => da.status === "delivered");
        const receivedAmount = filteredArr.reduce((total: number, order: any) => total + order.totalAmount, 0);
        setTotalAmount(totalAmount);
        setReceivedAmount(receivedAmount);
      })
      .catch((error) => console.log("Error fetching orders:", error));

  }, []);

  return (
    <>
      <Navbar page={"Dashboard"} />
      <div className="flex justify-between">
        <main className="p-6 w-3/4 pt-0 pr-0">

          {/* Financial Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Orders</span>
                <span className="text-sm text-green-500">+5%</span>
              </div>
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-gray-500">+500 than last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Orders delivered</span>
                <span className="text-sm text-red-500">-2%</span>
              </div>
              <div className="text-2xl font-bold">{orders.filter((order: any) => order.status === "delivered").length}</div>
              <div className="text-sm text-gray-500">-200 than last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Payment Expected</span>
                <span className="text-sm text-red-500">-3%</span>
              </div>
              <div className="text-2xl font-bold">
                ${totalAmount}
              </div>
              <div className="text-sm text-gray-500">-100 than last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Payment Received</span>
                <span className="text-sm text-green-500">+8%</span>
              </div>
              <div className="text-2xl font-bold">${receivedAmount}</div>
              <div className="text-sm text-gray-500">+300 than last month</div>
            </div>
          </div>

          {/* Map Component showing active orders */}
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex flex-col ">
              <div className="h-8 flex justify-between">
                <h2 className="text-lg font-semibold">Active Orders</h2>
                <button className="text-green-700 font-bold">View all</button>
              </div>
              <div className="flex-1">
                <MapComponent
                  orders={orders.filter((o: any) => o.status === "assigned")}
                />
              </div>
            </div>
          </div>

          {/* Latest Assignments Table */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Assignments</h2>
              <button className="text-green-700 font-bold">View all</button>
            </div>
            <AssignmentTable />
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="w-1/4 h-screen flex flex-col gap-6 px-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <OrdersPieChart />
          </div>

          <PieChart showText={true} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
