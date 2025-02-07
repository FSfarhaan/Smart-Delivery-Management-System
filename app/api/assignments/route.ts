import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";

// ✅ GET All Assignments
export async function GET() {
  try {
    await connectDB();
    const assignments = await Assignment.find();
    return NextResponse.json(assignments);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching assignments", error }, { status: 500 });
  }
}

// ✅ POST (Create New Assignment)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newAssignment = await Assignment.create(body);
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating assignment", error }, { status: 500 });
  }
}
