import React from 'react';

interface IOrder {
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  area: string;
  items: { name: string; quantity: number; price: number }[];
  status: "pending" | "assigned" | "picked" | "delivered" | "failed";
  assignedTo?: string; // Partner ID
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderTable = ({ orders, type, openEditModal }: { orders: IOrder[], type: string, openEditModal: any }) => {
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
