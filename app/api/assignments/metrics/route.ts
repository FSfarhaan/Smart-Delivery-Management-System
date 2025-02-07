import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";

export async function GET() {
  try {
    await connectDB();

    const totalAssigned = await Assignment.countDocuments();
    const totalSuccess = await Assignment.countDocuments({ status: "success" });
    const successRate = totalAssigned > 0 ? (totalSuccess / totalAssigned) * 100 : 0;

    const failureReasons = await Assignment.aggregate([
      { $match: { status: "failed" } },
      { $group: { _id: "$reason", count: { $sum: 1 } } },
      { $project: { reason: "$_id", count: 1, _id: 0 } },
    ]);

    return NextResponse.json({
      totalAssigned,
      successRate: successRate.toFixed(2),
      failureReasons,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching assignment metrics", error }, { status: 500 });
  }
}
