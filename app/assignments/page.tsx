"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrdersPieChart from "../components/OrderStatusPie";
import AssignmentTable from "../components/AssignmentTable";
import { fetchAssignmentMetrics, fetchAssignments } from "../api/assignments";
import FailedOrders from "../components/FailedOrders";

export interface AssigmentMetrics {
  totalAssigned: number;
  successRate: string,
  failureReasons: [{
    count: number,
    reason: string;
  }]
}


export default function AssignmentsPage() {
  // const { assignments, loading } = useAssignmentContext();
  const [statusFilter, setStatusFilter] = useState("");
  const [assignments, setAssignments] = useState([])
  const [metrics, setMetrics] = useState<AssigmentMetrics>();

  // const filteredAssignments = assignments.filter((assignment) =>
  //   statusFilter ? assignment.status === statusFilter : true
  // );
  

  useEffect(() => {
    fetchAssignments().then(setAssignments);
    fetchAssignmentMetrics().then(setMetrics);
  }, []);


  return (
    <>
      <Navbar page={"Assignments"} />

      <div className="flex justify-between">
        <main className="p-6 w-3/4 pt-0 pr-0">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Assignments</span>
                <span className="text-sm text-green-500">+5%</span>
              </div>
              <div className="text-2xl font-bold">{assignments.length}</div>
              <div className="text-sm text-gray-500">+500 than last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Active Assignments</span>
                <span className="text-sm text-red-500">-2%</span>
              </div>
              <div className="text-2xl font-bold">
                {
                  assignments.filter((a: any) => a.status === "pending").length
                }
              </div>
              <div className="text-sm text-gray-500">-200 than last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Assignments Pending</span>
                <span className="text-sm text-red-500">-3%</span>
              </div>
              <div className="text-2xl font-bold">
                {assignments.filter((a: any) => a.status === "pending").length}
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

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Assignments</h2>
              <button className="text-green-700 font-bold">View all</button>
            </div>

            {/* <OrderTable orders={orders.slice(0, 3)} type="dash" openEditModal={null}/> */}
            <AssignmentTable />
          </div>
        </main>

        {/* Right Side */}
        <div className="w-1/4 h-screen flex flex-col gap-6 px-6">
          <FailedOrders />

          <div className="bg-white p-4 rounded-lg shadow">
            <OrdersPieChart />
          </div>
        </div>
      </div>
    </>
  );
}
