import mongoose, { Schema, Types } from "mongoose";

// 1️⃣ Define TypeScript Interface
export interface IPartner {
  _id: Types.ObjectId | null;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  currentLoad: number; // max: 3
  area: string[];
  shift: { start: string; end: string };
  metrics: { rating: number; completedOrders: number; cancelledOrders: number };
}

export interface PartnersArea {
  count: number;
  area: string[];
}

// 2️⃣ Define Mongoose Schema
const PartnerSchema = new Schema<IPartner>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  currentLoad: { type: Number, required: true, default: 0, max: 3 },
  area: { type: [String], required: true },
  shift: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  metrics: {
    rating: { type: Number, required: true, default: 5 },
    completedOrders: { type: Number, required: true, default: 0 },
    cancelledOrders: { type: Number, required: true, default: 0 },
  },
});

// 3️⃣ Export the Model
export default mongoose.models.Partner || mongoose.model<IPartner>("Partner", PartnerSchema);
