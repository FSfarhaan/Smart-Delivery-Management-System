import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Partner from "@/models/Partner";
import Assignment from "@/models/Assignment";
import { getBatchCoordinates } from "@/utils/geocode";

async function autoAssignPartner(orderArea: string) {
  await connectDB();
  const availablePartners = await Partner.find({
    areas: orderArea,
    currentLoad: { $lt: 3 },
  }).sort({ currentLoad: 1, "metrics.rating": -1 });

  return availablePartners.length ? availablePartners[0] : null;
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });

    if (!orders) {
      return NextResponse.json({ message: "Cannot get order" }, { status: 404 });
    }
    return NextResponse.json(orders);

  } catch (error) {
    return NextResponse.json({ message: "Error getting order", error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const assignedPartner = await autoAssignPartner(body.area);

    const newOrder = await Order.create({
      ...body,
      assignedTo: assignedPartner ? assignedPartner._id : null,
      status: assignedPartner ? "assigned" : "pending",
    });

    if (assignedPartner) {
      await Partner.findByIdAndUpdate(assignedPartner._id, { $inc: { currentLoad: 1 } });

      // ✅ Create Assignment with "pending" status
      await Assignment.create({
        orderId: newOrder._id,
        partnerId: assignedPartner._id,
        status: "pending", // ✅ Set as "pending" instead of "success"
        timestamp: new Date(),
      });
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating order", error }, { status: 500 });
  }
}
