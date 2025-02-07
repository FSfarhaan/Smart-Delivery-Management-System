import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Assignment from "@/models/Assignment";
import Partner from "@/models/Partner";

// ✅ UPDATE Order by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const body = await req.json();
      const order = await Order.findById(params.id);
  
      if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });
  
      const updatedOrder = await Order.findByIdAndUpdate(params.id, body, { new: true });
  
      if (order.assignedTo) {
        // ✅ If order is delivered, mark assignment as success & decrease workload
        if (body.status === "delivered") {
          await Assignment.findOneAndUpdate(
            { orderId: params.id },
            { status: "success" }
          );
  
          await Partner.findByIdAndUpdate(order.assignedTo, { $inc: { currentLoad: -1 } });
        }
  
        // ✅ If order fails, mark assignment as failed & decrease workload
        if (body.status === "failed") {
          await Assignment.findOneAndUpdate(
            { orderId: params.id },
            { status: "failed", reason: body.reason }
          );
  
          await Partner.findByIdAndUpdate(order.assignedTo, { $inc: { currentLoad: -1 } });
        }
      }
  
      return NextResponse.json(updatedOrder);
    } catch (error) {
      return NextResponse.json({ message: "Error updating order", error }, { status: 500 });
    }
  }
  
  
  

// ✅ DELETE Order by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedOrder = await Order.findByIdAndDelete(params.id);
    if (!deletedOrder) return NextResponse.json({ message: "Order not found" }, { status: 404 });
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting order", error }, { status: 500 });
  }
}
