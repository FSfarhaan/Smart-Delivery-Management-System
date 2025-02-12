"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrdersPieChart from "../components/StatusPie";
import AssignmentTable from "../components/AssignmentTable";
import { fetchAssignmentMetrics, fetchAssignments } from "../api/assignments";
import FailedOrders from "../components/FailedOrders";
import Sidebar from "../components/Sidebar";
import { IAssignment } from "@/models/Assignment";

export interface AssigmentMetrics {
  totalAssigned: number;
  successRate: string,
  failureReasons: [{
    count: number,
    reason: string;
  }]
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [metrics, setMetrics] = useState<AssigmentMetrics>();

  useEffect(() => {
    fetchAssignments().then(setAssignments);
    fetchAssignmentMetrics().then(setMetrics);
  }, []);


  return (
    <div className="flex justify-between">
      <Sidebar pathname={"assignments"}/>
      <div className="md:ml-64 w-full overflow-y-scroll md:overflow-y-hidden">
        <Navbar page={"Assignments"} />

        <div className="flex justify-between md:mt-0 mt-16 md:flex-row flex-col">
          <main className="md:p-6 md:w-3/4 md:pt-0 md:pr-0 p-4">

            <div className="md:grid md:grid-cols-4 gap-4 mb-6 max-w-full overflow-x-auto flex-nowrap flex">
              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Total Assignments</span>
                  <span className="text-sm text-green-500">+5%</span>
                </div>
                <div className="text-2xl font-bold">{assignments.length}</div>
                <div className="text-sm text-gray-500">+500 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Active Assignments</span>
                  <span className="text-sm text-red-500">-2%</span>
                </div>
                <div className="text-2xl font-bold">
                  {
                    assignments.filter((a: IAssignment) => a.status === "pending").length
                  }
                </div>
                <div className="text-sm text-gray-500">-200 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Failed</span>
                  <span className="text-sm text-red-500">+3%</span>
                </div>
                <div className="text-2xl font-bold">
                  {assignments.filter((a: IAssignment) => a.status === "failed").length}
                </div>
                <div className="text-sm text-gray-500">-100 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
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
                <div>
                  <h2 className="text-lg font-semibold">Recent Assignments</h2>
                  <h5 className="text-gray-500 md:text-sm text-xs mb-3">Here can be seen the complete list of assignments.</h5>
                </div>
              </div>

              <div className="w-full overflow-x-scroll md:overflow-x-hidden">
                <AssignmentTable />
              </div>
            </div>
          </main>

          {/* Right Side */}
          <div className="flex-1 h-screen flex flex-col gap-6 md:px-6 px-4 pb-24 md:pb-16">
            <FailedOrders />

            <div className="bg-white p-4 rounded-lg shadow">
              <OrdersPieChart />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
