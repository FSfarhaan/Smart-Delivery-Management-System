import axios from "axios";
import React, { useEffect, useState } from "react";
import { fetchAssignments } from "../api/assignments";
import { usePathname } from "next/navigation";
import { ObjectId } from "mongoose";

interface assignmentProps  {
    _id: string;
    orderId: ObjectId;
    partnerId: ObjectId;
    timestamp: Date,
    status: string;
}

const AssignmentTable = () => {
  const [assignments, setAssignments] = useState<assignmentProps[]>([]);
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]); // Explicitly set as an array of strings
  const pathName = usePathname();

  const getOrderNumber = async (id: ObjectId) => {
    try {
      const res = await axios.get(`/api/orders/getById/${id}`);
      return res.data.orderNumber; // Assuming `orderNumber` is inside `res.data`
    } catch (error) {
      console.error("Error fetching order number:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAssignments();
        if(pathName === "/assignments")
            setAssignments(data);
        else setAssignments(data.slice(0, 3));
  
        const orderNumbersPromises = data.map((d: assignmentProps) =>
          getOrderNumber(d.orderId)
        );
        const resolvedOrderNumbers = await Promise.all(orderNumbersPromises);
  
        setOrderNumbers(resolvedOrderNumbers);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
  
    fetchData();
  }, [pathName]); // Include dependencies if needed
  
  return (
    <table className="w-full">
      <thead>
        <tr className="text-gray-500 md:text-md text-sm" >
          <th className="text-left pb-4">Order Number</th>
          <th className="text-left pb-4">Status</th>
          <th className="text-left pb-4">Date</th>
          <th className="text-right pb-4">Assigned to</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((assignment: assignmentProps, index) => (
          <tr key={assignment._id} className="border-t md:text-md text-sm">
            <td className="py-3 pr-16">{orderNumbers.at(index)}</td>
            <td className="pr-12">
              <span
                className={`px-2 py-1 rounded-full text-sm whitespace-nowrap ${
                    assignment.status === "pending"
                    ? "bg-blue-100 text-blue-700" // Yellow for pending
                    : assignment.status === "success"
                    ? "bg-green-100 text-green-700" // Green for delivered
                    : "bg-red-100 text-red-700"
                }`}
              >
                {assignment.status === "success" ? "delivered" : assignment.status === "pending" ? "on the way" : assignment.status}
              </span>
            </td>
            <td className="pr-10">{new Date(assignment.timestamp).toLocaleDateString()}</td>
            <td className="text-right">{assignment.partnerId.toString() || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssignmentTable;
