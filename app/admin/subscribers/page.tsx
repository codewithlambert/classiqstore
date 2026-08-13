"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Download, Mail, Send, Megaphone } from "lucide-react";

interface Sub { id: string; email: string; created_at: string; }

export default function SubscribersPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState("");
  const [broadcast, setBroadcast] = useState({
    subject: "", headline: "", body: "", ctaLabel: "", ctaHref: "", target: "subscribers",
  });

  useEffect(() => {
    createClient().from("subscribers").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setSubs(data ?? []);
      setLoading(false);
    });
  }, []);

  function exportCSV() {
    const rows = subs.map((s) => [s.email, new Date(s.created_at).toLocaleDateString("en-NG")].join(","));
    const csv = ["Email,Joined", ...rows].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `subscribers-${Date.now()}.csv`;
    a.click();
  }

  async function handleBroadcast() {
    if (!broadcast.subject || !broadcast.headline || !broadcast.body) return;
    setSending(true);
    const res = await fetch("/api/emails/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(broadcast),
    });
    const data = await res.json();
    setSending(false);
    setSentMsg(data.ok ? `Sent to ${data.sent} recipient${data.sent !== 1 ? "s" : ""} ✓` : "Failed to send.");
    setTimeout(() => setSentMsg(""), 5000);
    if (data.ok) setBroadcast({ subject: "", headline: "", body: "", ctaLabel: "", ctaHref: "", target: "subscribers" });
  }

  const inputCls = "w-full bg-white/5 border border-white/8 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#C9A84C]/40 transition-all font-body placeholder-white/20";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A84C]/60 font-body mb-1">Admin</p>
            <h1 className="font-heading text-3xl font-bold text-white">Subscribers</h1>
          </div>
          <span className="px-3 py-1 bg-[#C9A84C]/15 border border-[#C9A84C]/20 text-[#C9A84C] text-sm font-bold rounded-full font-heading mt-4">
            {subs.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBroadcast((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#C9A84C]/30 text-[#C9A84C]/70 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors text-sm font-body btn-3d">
            <Megaphone size={15} /> Broadcast
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/40 hover:border-white/25 hover:text-white transition-colors text-sm font-body btn-3d">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* ── Broadcast panel ── */}
      {showBroadcast && (
        <div className="bg-[#0a0806] border border-[#C9A84C]/20 rounded-2xl p-6 flex flex-col gap-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A84C]/60 font-body">Send Newsletter / Announcement</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-body">Send to</label>
              <select value={broadcast.target} onChange={(e) => setBroadcast((b) => ({ ...b, target: e.target.value }))}
                className={inputCls}>
                <option value="subscribers" className="bg-[#0a0806]">Newsletter subscribers only</option>
                <option value="users" className="bg-[#0a0806]">Registered users only</option>
                <option value="all" className="bg-[#0a0806]">Everyone (subscribers + users)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-body">Subject line</label>
              <input value={broadcast.subject} onChange={(e) => setBroadcast((b) => ({ ...b, subject: e.target.value }))}
                placeholder="e.g. New collection just dropped" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-body">Headline</label>
              <input value={broadcast.headline} onChange={(e) => setBroadcast((b) => ({ ...b, headline: e.target.value }))}
                placeholder="e.g. The Summer Edit is here." className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-body">Body</label>
              <textarea rows={4} value={broadcast.body} onChange={(e) => setBroadcast((b) => ({ ...b, body: e.target.value }))}
                placeholder="Write your message here. HTML is supported."
                className={`${inputCls} resize-none`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-body">Button label (optional)</label>
              <input value={broadcast.ctaLabel} onChange={(e) => setBroadcast((b) => ({ ...b, ctaLabel: e.target.value }))}
                placeholder="e.g. Shop now" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-body">Button URL (optional)</label>
              <input value={broadcast.ctaHref} onChange={(e) => setBroadcast((b) => ({ ...b, ctaHref: e.target.value }))}
                placeholder="https://classiqstore.pxxl.click/shop" className={inputCls} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleBroadcast} disabled={sending || !broadcast.subject || !broadcast.headline || !broadcast.body}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A84C] text-[#0f0d0b] font-semibold text-sm font-body hover:bg-[#a8891e] transition-all disabled:opacity-50 btn-3d btn-3d-gold">
              <Send size={14} /> {sending ? "Sending…" : "Send email"}
            </button>
            {sentMsg && <span className="text-sm font-body text-emerald-400">{sentMsg}</span>}
          </div>
        </div>
      )}

      <div className="bg-[#0a0806] border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="h-40 flex items-center justify-center text-sm text-white/30 font-body">Loading…</div>
        ) : subs.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center gap-2 text-white/25">
            <Mail size={28} strokeWidth={1.2} />
            <p className="text-sm font-body">No subscribers yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6">
                {["#", "Email", "Joined"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.2em] uppercase text-white/25 font-normal font-body">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map((s, i) => (
                <tr key={s.id} className="border-b border-white/4 last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-3 text-white/25 text-xs font-body">{i + 1}</td>
                  <td className="px-5 py-3 text-white/70 font-body">{s.email}</td>
                  <td className="px-5 py-3 text-white/30 text-xs font-body">{new Date(s.created_at).toLocaleDateString("en-NG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
