import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET() {
  const customers = await Customer.find().sort({ order: -1 });
  return NextResponse.json(customers, { status: 200 });
}

export async function POST(request) {
  const body = await request.json();
  const customer = new Customer(body);
  await customer.save();
  return NextResponse.json(customer, {
    status: 201,
    message: "Customer created successfully",
  });
}

export async function PUT(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const customer = await Customer.findByIdAndUpdate(_id, updateData, {
    new: true,
  });

  if (!customer) {
    return NextResponse.json(
      { message: "Customer not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(customer, {
    status: 200,
    message: "Customer updated successfully",
  });
}
