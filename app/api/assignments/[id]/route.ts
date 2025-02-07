import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";

// ✅ UPDATE Assignment by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedAssignment = await Assignment.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedAssignment) return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    return NextResponse.json(updatedAssignment);
  } catch (error) {
    return NextResponse.json({ message: "Error updating assignment", error }, { status: 500 });
  }
}

// ✅ DELETE Assignment by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedAssignment = await Assignment.findByIdAndDelete(params.id);
    if (!deletedAssignment) return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting assignment", error }, { status: 500 });
  }
}
