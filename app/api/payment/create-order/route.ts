import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import Plans from "@/models/plan";
import User from "@/models/user";

export async function POST(req: Request) {
  console.log("Key ID:", process.env.NEXT_RAZORPAY_KEY_ID!);
  console.log("Key Secret:", process.env.NEXT_RAZORPAY_KEY_SECRET!);

  try {
    const { amount, planName, planId, userId } = await req.json();

    const options = {
      amount: Number(amount),
      currency: "INR",
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);

    const plan = await Plans.findById(planId);

    if (!response && plan.length <= 0) return;

    const user = await User.findById(userId);

    if (!user) return;
    user.maxLimit = plan.maxLimit;
    user.currentLimit = plan.maxLimit;
    user.save();
    return NextResponse.json({
      success: true,
      message: "Order created successfully",  
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
