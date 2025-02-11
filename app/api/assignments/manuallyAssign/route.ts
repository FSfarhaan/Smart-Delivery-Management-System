import { connectDB } from "@/lib/db";
import Partner from "@/models/Partner";
import Assignment from "@/models/Assignment";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      await connectDB();
      const body = await req.json();
  
      // Create the assignment
      const newAssignment = await Assignment.create(body);
  
      // Increment the partner's currentLoad by 1
      const partnerId = body.partnerId; // Assuming partnerId is in the request body
      const partner = await Partner.findByIdAndUpdate(
        partnerId,
        { $inc: { currentLoad: 1 } } // Increment the partner's currentLoad by 1
      );
  
      // Update the status of the Order to "pending"
      const orderId = body.orderId; // Assuming orderId is in the request body
      await Order.findByIdAndUpdate(
        orderId,
        { $set: { status: "assigned", assignedTo: partner._id } } // Set the order's status to "pending"
      );
  
      return NextResponse.json(newAssignment, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: "Error creating assignment", error }, { status: 500 });
    }
  }
  