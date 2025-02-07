import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Partner from "@/models/Partner";

// ✅ GET All Partners
export async function GET() {
  try {
    await connectDB();
    const partners = await Partner.find();
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching partners", error }, { status: 500 });
  }
}

// ✅ POST (Create New Partner)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newPartner = await Partner.create(body);
    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating partner", error }, { status: 500 });
  }
}
