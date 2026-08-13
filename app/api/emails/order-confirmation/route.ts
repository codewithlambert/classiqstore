import { NextRequest, NextResponse } from "next/server";
import { sendEmail, orderConfirmationEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const { name, email, orderId, items, total, address } = await req.json();
    await sendEmail(orderConfirmationEmail(name, email, orderId, items, total, address));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Order confirmation email failed:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
