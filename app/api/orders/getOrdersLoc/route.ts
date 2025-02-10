import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getBatchCoordinates } from "@/utils/geocode";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });

    if (!orders) {
      return NextResponse.json({ message: "Cannot get order" }, { status: 404 });
    }

    // Create a set of unique areas to avoid redundant geocoding requests
    const areas = [...new Set(orders.map((order) => order.area))];

    // Get coordinates for each unique area in parallel
    const areaCoordinates = await getBatchCoordinates(areas);

    // Map the coordinates back to the orders
    const ordersWithCoordinates = orders.map((order) => {
      const coords = areaCoordinates[order.area] || null;
      return { ...order.toObject(), coordinates: coords };
    });

    return NextResponse.json(ordersWithCoordinates);

  } catch (error) {
    return NextResponse.json({ message: "Error getting order", error }, { status: 500 });
  }
}