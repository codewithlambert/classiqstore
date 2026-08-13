import { NextRequest, NextResponse } from "next/server";
import { sendEmail, orderStatusEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const { name, email, orderId, status, total } = await req.json();
    await sendEmail(orderStatusEmail(name, email, orderId, status, total));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Order status email failed:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
