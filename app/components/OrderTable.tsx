import React from 'react';
import { IOrder } from '@/models/Order';
import { Types } from 'mongoose';

const OrderTable = ({ orders, openAssignModal, openMarkModal }: { orders: IOrder[], openAssignModal: (order: Types.ObjectId) => void, openMarkModal: (order: Types.ObjectId) => void }) => {

  const openModal  = (assigned: boolean, order: Types.ObjectId | null) => {
    if(order) {
      if(assigned) openMarkModal(order);
      else openAssignModal(order);
    }
  }
  return (
    <table className="w-full">
      <thead>
        <tr className="text-gray-500 md:text-md text-sm">
          <th className="text-left pb-4">Order Number</th>
          <th className="text-left pb-4">Status</th>
          <th className="text-left pb-4">Date</th>
          <th className="text-left pb-4">Customer</th>
          <th className="text-right pb-4">Total</th>
          <th className="text-right pb-4">Assigned To</th>
          <th className="text-right pb-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.orderNumber} className="border-t md:text-md text-sm">
            <td className="py-3 pr-16">{order.orderNumber}</td>
            <td className='pr-10'>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700" // Yellow for pending
                      : order.status === "assigned"
                      ? "bg-blue-100 text-blue-700" // Blue for assigned
                      : order.status === "picked"
                      ? "bg-orange-100 text-orange-700" // Orange for picked
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-700" // Green for delivered
                      : "bg-red-100 text-red-700"
                  }`}

              >
                {order.status}
              </span>
            </td>
            <td className='pr-10'>{new Date(order.createdAt).toLocaleDateString()}</td>
            <td className='pr-10'>{order.customer.name}</td>
            <td className="text-right">${order.totalAmount.toFixed(2)}</td>
            <td className="text-right pl-10">{order.assignedTo || 'N/A'}</td>
            <td className="pl-10">
              <button onClick={() => openModal(order.assignedTo? true : false, order._id)} className={`${order.assignedTo? "bg-yellow-500" : "bg-orange-500"} text-white px-3 py-1 rounded`}>{order.assignedTo ? "Mark" : "Assign"}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
