const BREVO_API = "https://api.brevo.com/v3/smtp/email";
const SENDER = { name: "CLASSIQ", email: "samuelfisheries@gmail.com" };
const SITE = "https://classiqstore.pxxl.click";
const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

interface EmailPayload {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  sender?: { name: string; email: string };
}

function base(content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Inter,Arial,sans-serif;">
<div style="max-width:560px;margin:48px auto;padding:0 16px;">
<div style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 2px 12px rgba(15,23,42,0.07);">
<div style="background:#0F172A;padding:32px 40px;">
  <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.28em;color:#fff;text-transform:uppercase;">CLASSIQ</p>
</div>
<div style="padding:40px;">${content}</div>
<div style="padding:20px 40px 28px;border-top:1px solid #F1F5F9;text-align:center;">
  <p style="margin:0;font-size:11px;color:#CBD5E1;">© CLASSIQ · Lagos, Nigeria · <a href="${SITE}/privacy" style="color:#CBD5E1;text-decoration:underline;">Privacy Policy</a></p>
</div>
</div></div></body></html>`;
}

function cta(label: string, href: string) {
  return `<a href="${href}" style="display:block;text-align:center;padding:15px 32px;background:#0F172A;color:#fff;border-radius:999px;text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">${label}</a>`;
}

export async function sendEmail(payload: EmailPayload) {
  const res = await fetch(BREVO_API, {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY!, "content-type": "application/json" },
    body: JSON.stringify({ sender: payload.sender ?? SENDER, ...payload }),
  });
  if (!res.ok) throw new Error(`Brevo error: ${await res.text()}`);
  return res.json();
}

export async function sendBulkEmail(emails: string[], subject: string, htmlContent: string) {
  const to = emails.map((e) => ({ email: e }));
  return sendEmail({ to, subject, htmlContent });
}

// ── Welcome ────────────────────────────────────────────────────────────────
export function welcomeEmail(name: string, email: string): EmailPayload {
  return {
    to: [{ email, name }],
    subject: "Welcome to CLASSIQ — You're in.",
    htmlContent: base(`
      <h1 style="margin:0 0 12px;font-size:26px;font-weight:600;color:#0F172A;">Welcome, ${name}.</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">Your account is ready. Explore our new collection of refined womenswear — crafted with intention, made to last.</p>
      ${cta("Shop the collection", SITE)}
      <div style="margin:32px 0;background:#F8FAFC;border-radius:16px;padding:24px;">
        <p style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#94A3B8;">Your account perks</p>
        <p style="margin:6px 0;font-size:13px;color:#475569;">✦&nbsp;&nbsp;Track all your orders in one place</p>
        <p style="margin:6px 0;font-size:13px;color:#475569;">✦&nbsp;&nbsp;Save pieces to your wishlist</p>
        <p style="margin:6px 0;font-size:13px;color:#475569;">✦&nbsp;&nbsp;Request custom &amp; bespoke pieces</p>
        <p style="margin:6px 0;font-size:13px;color:#475569;">✦&nbsp;&nbsp;Early access to new drops</p>
      </div>
      <p style="font-size:12px;color:#94A3B8;text-align:center;">Questions? <a href="mailto:samuelfisheries@gmail.com" style="color:#475569;">samuelfisheries@gmail.com</a></p>
    `),
  };
}

// ── Order confirmation ──────────────────────────────────────────────────────
export function orderConfirmationEmail(
  name: string, email: string, orderId: string,
  items: { name: string; size?: string; quantity: number; price: number }[],
  total: number, address: string
): EmailPayload {
  const rows = items.map((i) => `
    <tr>
      <td style="padding:10px 0;font-size:13px;color:#0F172A;border-bottom:1px solid #F1F5F9;">${i.name}${i.size ? ` <span style="color:#94A3B8;">· ${i.size}</span>` : ""}</td>
      <td style="padding:10px 0;font-size:13px;color:#475569;border-bottom:1px solid #F1F5F9;text-align:center;">×${i.quantity}</td>
      <td style="padding:10px 0;font-size:13px;color:#0F172A;font-weight:600;border-bottom:1px solid #F1F5F9;text-align:right;">${fmt(i.price * i.quantity)}</td>
    </tr>`).join("");

  return {
    to: [{ email, name }],
    subject: `Order confirmed — #${orderId.slice(0, 8).toUpperCase()}`,
    htmlContent: base(`
      <h1 style="margin:0 0 6px;font-size:24px;font-weight:600;color:#0F172A;">Order confirmed.</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#475569;">Hi ${name}, we've received your order and we're getting it ready.</p>
      <div style="background:#F8FAFC;border-radius:16px;padding:20px 24px;margin:0 0 24px;">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#94A3B8;">Order ID</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#0F172A;">#${orderId.slice(0, 8).toUpperCase()}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">${rows}</table>
      <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #0F172A;">
        <span style="font-size:14px;font-weight:600;color:#0F172A;">Total</span>
        <span style="font-size:18px;font-weight:700;color:#0F172A;">${fmt(total)}</span>
      </div>
      <div style="background:#F8FAFC;border-radius:12px;padding:16px 20px;margin:0 0 28px;">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#94A3B8;">Delivering to</p>
        <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">${address}</p>
      </div>
      ${cta("Track my order", `${SITE}/profile`)}
      <p style="margin:24px 0 0;font-size:12px;color:#94A3B8;text-align:center;">Estimated delivery: 3–5 business days</p>
    `),
  };
}

// ── Order status update ─────────────────────────────────────────────────────
export function orderStatusEmail(
  name: string, email: string, orderId: string, status: string, total: number
): EmailPayload {
  const labels: Record<string, { title: string; body: string }> = {
    confirmed:   { title: "Your order is confirmed",    body: "We've confirmed your order and our team is preparing it." },
    processing:  { title: "Your order is being packed", body: "Our team is carefully packing your pieces." },
    shipped:     { title: "Your order is on its way",   body: "Your order has been shipped and is heading your way." },
    delivered:   { title: "Your order was delivered",   body: "We hope you love your new pieces. Enjoy!" },
    cancelled:   { title: "Your order was cancelled",   body: "Your order has been cancelled. If you have questions, please reach out." },
  };
  const { title, body } = labels[status] ?? { title: `Order ${status}`, body: "" };

  return {
    to: [{ email, name }],
    subject: `${title} — #${orderId.slice(0, 8).toUpperCase()}`,
    htmlContent: base(`
      <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;color:#0F172A;">${title}</h1>
      <p style="margin:0 0 8px;font-size:15px;color:#475569;">Hi ${name},</p>
      <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">${body}</p>
      <div style="background:#F8FAFC;border-radius:16px;padding:20px 24px;margin:0 0 28px;">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#94A3B8;">Order</p>
        <p style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0F172A;">#${orderId.slice(0, 8).toUpperCase()}</p>
        <p style="margin:0;font-size:13px;color:#475569;">Total: <strong>${fmt(total)}</strong></p>
      </div>
      ${status !== "cancelled" ? cta("Track my order", `${SITE}/profile`) : cta("Shop again", SITE)}
    `),
  };
}

// ── Custom request quote ────────────────────────────────────────────────────
export function quoteEmail(
  name: string, email: string, requestId: string, productType: string, quoteAmount: number
): EmailPayload {
  return {
    to: [{ email, name }],
    subject: `Your custom ${productType} quote — ${fmt(quoteAmount)}`,
    htmlContent: base(`
      <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;color:#0F172A;">Your quote is ready.</h1>
      <p style="margin:0 0 8px;font-size:15px;color:#475569;">Hi ${name},</p>
      <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">We've reviewed your custom <strong>${productType}</strong> request and prepared a quote.</p>
      <div style="background:#F8FAFC;border-radius:16px;padding:24px;margin:0 0 28px;text-align:center;">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#94A3B8;">Quote amount</p>
        <p style="margin:0 0 4px;font-size:32px;font-weight:700;color:#0F172A;">${fmt(quoteAmount)}</p>
        <p style="margin:0;font-size:12px;color:#94A3B8;">Request #${requestId.slice(0, 8).toUpperCase()}</p>
      </div>
      ${cta("View & accept quote", `${SITE}/profile`)}
      <p style="margin:24px 0 0;font-size:12px;color:#94A3B8;text-align:center;">Quote valid for 7 days.</p>
    `),
  };
}

// ── Newsletter / Announcement ───────────────────────────────────────────────
export function newsletterEmail(subject: string, headline: string, body: string, ctaLabel?: string, ctaHref?: string): EmailPayload {
  return {
    to: [],
    subject,
    htmlContent: base(`
      <h1 style="margin:0 0 16px;font-size:26px;font-weight:600;color:#0F172A;">${headline}</h1>
      <div style="font-size:15px;color:#475569;line-height:1.8;margin:0 0 28px;">${body}</div>
      ${ctaLabel && ctaHref ? cta(ctaLabel, ctaHref) : ""}
      <p style="margin:28px 0 0;font-size:11px;color:#94A3B8;text-align:center;">You're receiving this because you subscribed to CLASSIQ updates.</p>
    `),
  };
}

// ── Discount / Promo ────────────────────────────────────────────────────────
export function discountEmail(
  name: string, email: string, code: string, discountPct: number, expiryDate: string
): EmailPayload {
  return {
    to: [{ email, name }],
    subject: `${discountPct}% off just for you — ${code}`,
    htmlContent: base(`
      <h1 style="margin:0 0 12px;font-size:26px;font-weight:600;color:#0F172A;">A gift from CLASSIQ.</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">Hi ${name}, here's an exclusive discount just for you.</p>
      <div style="background:#0F172A;border-radius:20px;padding:32px;margin:0 0 28px;text-align:center;">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#94A3B8;">Your promo code</p>
        <p style="margin:0 0 8px;font-size:36px;font-weight:800;color:#fff;letter-spacing:0.12em;">${code}</p>
        <p style="margin:0;font-size:14px;color:#94A3B8;">${discountPct}% off your entire order</p>
      </div>
      <p style="margin:0 0 28px;font-size:13px;color:#94A3B8;text-align:center;">Valid until ${expiryDate}. One use per customer.</p>
      ${cta("Shop now", SITE)}
    `),
  };
}
