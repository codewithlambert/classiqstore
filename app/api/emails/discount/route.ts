import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, discountEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const { code, discountPct, expiryDate, target, email: singleEmail, name: singleName } = await req.json();
    const sb = createServiceClient();

    if (singleEmail) {
      // Send to a single user
      await sendEmail(discountEmail(singleName ?? "there", singleEmail, code, discountPct, expiryDate));
      return NextResponse.json({ ok: true, sent: 1 });
    }

    // Broadcast to all users
    const { data } = await sb.from("profiles").select("email, full_name").eq("is_admin", false);
    const recipients = (data ?? []).filter((r) => r.email);
    await Promise.all(recipients.map((r) =>
      sendEmail(discountEmail(r.full_name ?? "there", r.email!, code, discountPct, expiryDate))
    ));
    return NextResponse.json({ ok: true, sent: recipients.length });
  } catch (err) {
    console.error("Discount email failed:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
