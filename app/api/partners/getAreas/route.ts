import { NextResponse } from "next/server";
import Partner from "@/models/Partner"; // Ensure the correct import path
import { connectDB } from "@/lib/db";

// API Route Handler
export async function GET() {
  try {
    await connectDB();
    const areas = await Partner.aggregate([
      { $group: { _id: "$areas", count: { $sum: 1 } } },
      { $project: { _id: 0, area: "$_id", count: 1 } },
    ]);

    return NextResponse.json(areas);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" + error }, { status: 500 });
  }
}
