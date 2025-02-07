"use client";
import { useAssignmentContext } from "@/context/AssignmentContext";
import { useState } from "react";

export default function AssignmentsPage() {
  const { assignments, loading } = useAssignmentContext();
  const [statusFilter, setStatusFilter] = useState("");

  const filteredAssignments = assignments.filter((assignment) => (statusFilter ? assignment.status === statusFilter : true));

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>

      {/* Filter by Status */}
      <select className="border p-2 mb-4" onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Status</option>
        <option value="success">Success</option>
        <option value="failed">Failed</option>
      </select>

      {/* Assignments List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Partner ID</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((assignment) => (
            <tr key={assignment._id} className="text-center">
              <td className="border p-2">{assignment.orderId}</td>
              <td className="border p-2">{assignment.partnerId}</td>
              <td className="border p-2">{assignment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
