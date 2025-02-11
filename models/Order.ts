import mongoose, { Schema, Types } from "mongoose";

// 1️⃣ Define TypeScript Interface
export interface IOrder{
  _id: Types.ObjectId | null;
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  area: string;
  items: { name: string; quantity: number; price: number }[];
  status: "pending" | "assigned" | "picked" | "delivered" | "failed";
  assignedTo?: string; // Partner ID
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  reason?: string;
  coordinates: {
    lat: number; lng: number;
  }
}

export interface OrdersArea {
  count: number;
  area: string;
}

// 2️⃣ Define Mongoose Schema
const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    area: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: { type: String, enum: ["pending", "assigned", "picked", "delivered", "failed"], default: "pending" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
    totalAmount: { type: Number, required: true },
    coordinates: {
      lat: {type: Number}, lng: {type: Number}
    },
    reason: { type: String }
  },
  { timestamps: true }
);

// 3️⃣ Export the Model
export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
