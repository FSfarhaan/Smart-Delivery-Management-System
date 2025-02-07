"use client";

// types.ts
interface FinancialData {
  amount: number;
  percentage: number;
  change: number;
  label: string;
}

interface StatisticsData {
  earnings: number[];
  spendings: number[];
}

interface Invoice {
  id: string;
  status: "Paid" | "Overdue";
  date: string;
  customer: string;
  total: number;
  amountDue: number;
}

interface ForecastItem {
  label: string;
  current: number;
  total: number;
}

interface FailureReason {
  count: number;
  reason: string;
}

interface Metrics {
  totalAssigned: number;
  successRate: string;
  failureReasons: FailureReason[];
}

// page.tsx
import { FC, useState, useEffect } from "react";
import { fetchOrders } from "./api/order";
import dynamic from "next/dynamic";
import { fetchAssignmentMetrics } from "@/app/api/assignments";
import OrderTable from "@/app/components/OrderTable";
import PieChart from "@/app/components/PieChart";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Dashboard: FC = () => {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [failureCount, setFailureCount] = useState<number>(0);

  const MapComponent = dynamic(() => import("@/app/components/MapComponent"), {
    ssr: false, // Disable SSR for this component
  });

  useEffect(() => {
    fetchOrders()
      .then(async (data: any) => {
        setOrders(data);
      })
      .catch((error) => console.log("Error fetching orders:", error));

    fetchAssignmentMetrics()
      .then((data: Metrics) => {
        setMetrics(data);

        const totalFailureCount = data.failureReasons.reduce(
          (total, r) => total + r.count,
          0
        );
        setFailureCount(totalFailureCount);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar page={"Dashboard"} />
      <div className="flex justify-between">
        {/* Main Content */}
        <main className="p-6 w-3/4 pt-0 pr-0">
          {/* Financial Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Orders</span>
                <span className="text-sm text-green-500">+5%</span>
              </div>
              <div className="text-2xl font-bold">{metrics?.totalAssigned}</div>
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
                <span className="text-gray-600">Active orders</span>
                <span className="text-sm text-red-500">-3%</span>
              </div>
              <div className="text-2xl font-bold">
                {orders.filter((o: any) => o.status === "assigned").length}
              </div>
              <div className="text-sm text-gray-500">-100 than last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Success rate</span>
                <span className="text-sm text-green-500">+8%</span>
              </div>
              <div className="text-2xl font-bold">{metrics?.successRate}</div>
              <div className="text-sm text-gray-500">+300 than last month</div>
            </div>

            
          </div>

          {/* Statistics Chart */}
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex flex-col ">
              <div className="h-8 flex justify-between">
                <h2 className="text-lg font-semibold">Active Orders</h2>
                <button className="text-green-700 font-bold">View all</button>
              </div>
              {/* Add your preferred charting library here */}
              <div className="flex-1">
                <MapComponent
                  orders={orders.filter((o: any) => o.status === "assigned")}
                />
              </div>
            </div>
          </div>

          {/* Latest Assignments */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Assignments</h2>
              <button className="text-green-700 font-bold">View all</button>
            </div>

            <OrderTable orders={orders.slice(0, 3)} />
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="w-1/4 h-screen flex flex-col gap-6 px-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <span className="text-gray-600">Total Failed Deliveries</span>
            <div className="text-3xl font-bold my-2">{failureCount}</div>
            <div className="text-sm text-gray-500 mb-2">Failure reasons:</div>

            {metrics?.failureReasons.map((item) => (
              <div key={item.reason} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span>{item.reason}</span>
                  <span>
                    {item.count} /{" "}
                    {metrics.failureReasons.reduce(
                      (acc, reason) => acc + reason.count,
                      0
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-700 h-2 rounded-full"
                    style={{
                      width: `${
                        (item.count /
                          metrics.failureReasons.reduce(
                            (acc, reason) => acc + reason.count,
                            0
                          )) *100 }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
