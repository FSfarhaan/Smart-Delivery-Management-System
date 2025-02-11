import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { ObjectId } from "mongoose";

export async function GET(req: Request, { params }: { params: { id: ObjectId } }) {
  try {
    await connectDB();
    const { id }  = await params;
    if (!id) {
      return NextResponse.json({ message: "Missing Order ID" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Error fetching Order:", error);
    return NextResponse.json({ message: "Error fetching Order", error }, { status: 500 });
  }
}
