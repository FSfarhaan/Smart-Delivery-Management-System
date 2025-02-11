"use client";

import { FC, useState, useEffect } from "react";
import { fetchOrdersLoc } from "./api/order";
import PieChart from "@/app/components/PartnersPie";
import Navbar from "./components/Navbar";
import OrdersPieChart from "./components/StatusPie";
import AssignmentTable from "./components/AssignmentTable";
import MapComponent from "./components/MapComponent";
import Link from "next/link";
import Sidebar from "./components/Sidebar";

const Dashboard: FC = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);

  useEffect(() => {
    fetchOrdersLoc()
      .then((data: any) => {
        setOrders(data);
        const totalAmount = Math.floor (data.reduce((total: number, order: any) => total + order.totalAmount, 0));
        const filteredArr = data.filter((da: any) => da.status === "delivered");
        const receivedAmount = Math.floor( filteredArr.reduce((total: number, order: any) => total + order.totalAmount, 0));
        setTotalAmount(totalAmount);
        setReceivedAmount(receivedAmount);
      })
      .catch((error) => console.log("Error fetching orders:", error));

  }, []);

  return (
    <div className="flex justify-between">
      <Sidebar pathname={"dashboard"}/>
      <div className="md:ml-64 w-full overflow-y-scroll md:overflow-y-hidden">
        <Navbar page={"Dashboard"} />
        <div className="flex justify-between md:mt-0 mt-16 md:flex-row flex-col">
          <main className="md:p-6 md:w-3/4 md:pt-0 md:pr-0 p-4">

            {/* Financial Cards */}
            <div className="md:grid md:grid-cols-4 gap-4 mb-6 max-w-full overflow-x-auto flex-nowrap flex">
              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="text-sm text-green-500">+5%</span>
                </div>
                <div className="text-2xl font-bold">{orders.length}</div>
                <div className="text-sm text-gray-500">+500 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Orders delivered</span>
                  <span className="text-sm text-red-500">-2%</span>
                </div>
                <div className="text-2xl font-bold">{orders.filter((order: any) => order.status === "delivered").length}</div>
                <div className="text-sm text-gray-500">-200 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Payment Expected</span>
                  <span className="text-sm text-red-500">-3%</span>
                </div>
                <div className="text-2xl font-bold">
                  ${totalAmount}
                </div>
                <div className="text-sm text-gray-500">-100 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
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
                <div className="flex justify-between items-center">
                  <div className="w-3/4">
                    <h2 className="text-lg font-semibold">Active Orders</h2>
                    <h5 className="text-gray-500 md:text-sm text-xs mb-3">Here can be seen the orders which is currently active or assigned</h5>
                  </div>
                  <Link href="/orders">
                    <button className="text-green-700 font-bold">View all</button>
                  </Link>
                </div>
                <div className="flex-1" style={{zIndex: 1}}>
                    <MapComponent
                      orders={orders.filter((o: any) => o.status === "assigned")}
                    />
                </div>
              </div>
            </div>

            {/* Latest Assignments Table */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-3/4">
                  <h2 className="text-lg font-semibold">Recent Assignments</h2>
                  <h5 className="text-gray-500 md:text-sm text-xs mb-3">Click on View all to see the complete logs of assignment</h5>
                </div>
                <Link href="/assignments">
                  <button className="text-green-700 font-bold">View all</button>
                </Link>
              </div>
              <div className="w-full overflow-x-scroll md:overflow-x-hidden">
                <AssignmentTable />
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <div className="flex-1 h-screen flex flex-col gap-6 md:px-6 px-4 pb-24 md:pb-16">
            <div className="bg-white p-4 rounded-lg shadow">
              <OrdersPieChart />
            </div>

            <PieChart showText={true} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
