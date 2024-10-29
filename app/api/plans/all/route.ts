import Plans from "@/models/plan";
import { NextResponse } from "next/server";

export async function GET(Req: Request) {
  const plans = await Plans.find({});
  
  if (!plans) {
    return NextResponse.json({
      status: false,
      message: "plans not found",
    });
  }

  return NextResponse.json({
    status: true,
    message: "plans found",
    plans,
  });
}
