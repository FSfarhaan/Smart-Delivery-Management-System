import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAssignment extends Document {
  orderId: Types.ObjectId;
  partnerId: Types.ObjectId;
  timestamp: Date;
  status: "pending" | "success" | "failed"; // ✅ Added "pending"
  reason?: string;
}

const AssignmentSchema = new Schema<IAssignment>({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner", required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "success", "failed"], required: true }, // ✅ Fixed Enum
  reason: { type: String, required: false },
});

export default mongoose.models.Assignment || mongoose.model<IAssignment>("Assignment", AssignmentSchema);
