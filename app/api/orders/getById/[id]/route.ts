import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { Types } from "mongoose";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    // Ensure the ID is valid before querying
    if (!params.id) {
      return NextResponse.json({ message: "Missing Order ID" }, { status: 400 });
    }

    // Convert ID to ObjectId before querying MongoDB
    const order = await Order.findById(new Types.ObjectId(params.id));
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Error fetching Order:", error);
    return NextResponse.json({ message: "Error fetching Order", error }, { status: 500 });
  }
}

