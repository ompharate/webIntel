import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID!,
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { amount } = await req.json();
  console.log(amount);
  const options = {
    amount: amount,
    currency: "INR",
    receipt: "receipt#1",
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
  console.log(response)
    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {   
    return NextResponse.json({
      success: false,
    });
  }
}
