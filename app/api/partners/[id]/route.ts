import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Partner from "@/models/Partner";

// ✅ UPDATE Partner by ID
export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();
    const body = await req.json();
    const updatedPartner = await Partner.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedPartner) return NextResponse.json({ message: "Partner not found" }, { status: 404 });
    return NextResponse.json(updatedPartner);
  } catch (error) {
    return NextResponse.json({ message: "Error updating partner", error }, { status: 500 });
  }
}

// ✅ DELETE Partner by ID
export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();
    const deletedPartner = await Partner.findByIdAndDelete(params.id);
    if (!deletedPartner) return NextResponse.json({ message: "Partner not found" }, { status: 404 });
    return NextResponse.json({ message: "Partner deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting partner", error }, { status: 500 });
  }
}
