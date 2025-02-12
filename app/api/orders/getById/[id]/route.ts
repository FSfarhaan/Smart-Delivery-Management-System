import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();

    if (!params?.id) return NextResponse.json({ message: "Missing Order ID" }, { status: 400 });

    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Error fetching Order:", error);
    return NextResponse.json({ message: "Error fetching Order", error }, { status: 500 });
  }
}
