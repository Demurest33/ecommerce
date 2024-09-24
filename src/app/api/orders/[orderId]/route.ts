import { NextResponse } from "next/server";
import { Order } from "@/types/Order";

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const orderId = parseInt(params.orderId);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  return NextResponse.json({ message: `Order ${params.orderId}` });
}
