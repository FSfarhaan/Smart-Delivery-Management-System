import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Partner from "@/models/Partner";
import Order from "@/models/Order";
import Assignment from "@/models/Assignment";

export async function GET() {
  try {
    await connectDB();

    const testPartner = await Partner.create({
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      areas: ["New York", "Los Angeles"],
      shift: { start: "09:00", end: "18:00" },
      metrics: { rating: 4.5, completedOrders: 10, cancelledOrders: 2 },
    });

    return NextResponse.json({ message: "✅ Models are working!", partner: testPartner });
  } catch (error) {
    console.error("❌ Error in models:", error);
    return NextResponse.json({ message: "❌ Model Test Failed" }, { status: 500 });
  }
}
