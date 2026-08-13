import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendBulkEmail, newsletterEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const { subject, headline, body, ctaLabel, ctaHref, target } = await req.json();
    // target: "subscribers" | "users" | "all"
    const sb = createServiceClient();
    const emails: string[] = [];

    if (target === "subscribers" || target === "all") {
      const { data } = await sb.from("subscribers").select("email");
      (data ?? []).forEach((r) => emails.push(r.email));
    }
    if (target === "users" || target === "all") {
      const { data } = await sb.from("profiles").select("email").eq("is_admin", false);
      (data ?? []).forEach((r) => { if (r.email && !emails.includes(r.email)) emails.push(r.email); });
    }

    if (emails.length === 0) return NextResponse.json({ error: "No recipients" }, { status: 400 });

    const payload = newsletterEmail(subject, headline, body, ctaLabel, ctaHref);
    await sendBulkEmail(emails, payload.subject, payload.htmlContent);
    return NextResponse.json({ ok: true, sent: emails.length });
  } catch (err) {
    console.error("Newsletter email failed:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
