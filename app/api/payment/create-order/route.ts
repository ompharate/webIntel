import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";

export async function POST(req: Request) {
  console.log("Key ID:", process.env.NEXT_RAZORPAY_KEY_ID!);
  console.log("Key Secret:", process.env.NEXT_RAZORPAY_KEY_SECRET!);

  try {
    const { amount } = await req.json();

    const options = {
      amount: Number(amount),
      currency: "INR",
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);
    console.log("Order Response:", response);

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({
      success: false,
      message: error || "Internal Server Error",
    });
  }
}
