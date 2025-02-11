import { IPartner } from "@/models/Partner";
import { createManually } from "../api/assignments";
import mongoose from "mongoose";
import { IAssignment } from "@/models/Assignment";
import React from "react";
import Error from "next/error";

export default function PartnersTable({ couriers, openEditModal, showMinified, closeAssignModal }: { couriers: IPartner[] | null, openEditModal: (partner: IPartner | null) => void, showMinified: boolean, closeAssignModal: () => void }) {  

  const handleClick = (courier: IPartner) => {
    showMinified ? assignManually(courier) : openEditModal(courier);
  }

  const assignManually = (courier: IPartner) => {
    const oId = localStorage.getItem("selectedOrder");
    if(oId && courier._id) {
      const mongooseObj = new mongoose.Types.ObjectId(oId);
      const payload: IAssignment = {
          orderId: mongooseObj,
          partnerId: courier._id,
          timestamp: new Date(),
          status: "pending"
        }
        createManually(payload).then(closeAssignModal).catch((err: Error) => console.log(err));
      } 
  }

  return (
    <>
      {/* Partners List */}
      <table className="w-full">
      <thead>
        <tr className="text-gray-500 md:text-md text-sm">
          <th className="text-left pb-4">Name</th>
          <th className="text-left pb-4">Status</th>
          {/* <th className="text-left pb-4">Phone</th> */}
          {/* <th className="text-left pb-4">Shift</th> */}
          
          {!showMinified && <th className="text-left pb-4">Rating</th> }
          {!showMinified && <th className="text-left pb-4">Completed</th> }
          {!showMinified && <th className="text-left pb-4">Cancelled</th> }
          <th className="text-left pb-4">Current Load</th>
          <th className="text-left pb-4">Areas</th>
          <th className="text-right pb-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {couriers && couriers.map((courier, index) => (
          <tr key={index} className="border-t md:text-md text-sm" >
            <td className="py-3 pr-10">{courier.name}</td>
            <td className="pr-8">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  courier.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {courier.status}
              </span>
            </td>
            {/* <td className="">{courier.phone.slice(0, 4)}...</td> */}
            {/* <td className="">{courier.shift.start} - {courier.shift.end}</td> */}
            {!showMinified && <td className="text-center pr-16">{courier.metrics.rating}</td> }
            {!showMinified && <td className="text-center pr-20">{courier.metrics.completedOrders}</td> }
            {!showMinified && <td className="text-center pr-20">{courier.metrics.cancelledOrders}</td> }
            <td className="text-center pr-28">{courier.currentLoad}</td>
            <td className="">{courier.area?.join(", ")}</td>
            
            <td className="pl-10">
              <button onClick={() => handleClick(courier)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                {showMinified ? "Assign" : "Edit"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      
    </>
  );
}
