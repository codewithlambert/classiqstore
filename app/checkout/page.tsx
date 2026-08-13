"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle, ShoppingBag, MessageCircle, Lock, User, Phone, MapPin, Mail
} from "lucide-react";
import { useCart } from "@/store/cart";
import { createClient } from "@/lib/supabase/client";
import { openWhatsAppCheckout, validateCheckoutData } from "@/lib/whatsapp";
import type { WhatsAppCheckoutData } from "@/lib/types";

const DELIVERY_FEE = 3500;
const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [done, setDone] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setIsSignedIn(!!data.user);
      if (data.user?.email) {
        setForm(f => ({ ...f, email: data.user.email || '' }));
      }
    });
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    notes: ""
  });

  const cartItems = items;
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  const handleField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleWhatsAppCheckout = () => {
    setErrors([]);
    
    const checkoutData: WhatsAppCheckoutData = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img,
        quantity: item.qty,
        product_type: item.product_type,
        attributes: item.attributes,
        size: item.size,
        color: item.color,
      })),
      total,
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email,
      shippingAddress: `${form.address}, ${form.city}, ${form.state}`,
      notes: form.notes,
    };

    const validation = validateCheckoutData(checkoutData);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setProcessing(true);
    
    // Open WhatsApp
    openWhatsAppCheckout(checkoutData);
    
    // Mark as done
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      clear();
    }, 1000);
  };

  /* ── Empty cart gate ── */
  if (items.length === 0 && !done) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-6 py-20">
        <div className="glass rounded-3xl p-10 w-full max-w-md flex flex-col items-center text-center gap-7">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag size={24} strokeWidth={1.4} className="text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl text-foreground">Your bag is empty</h1>
            <p className="text-sm text-muted-foreground">Add some pieces before checking out.</p>
          </div>
          <Link href="/shop" className="w-full py-4 rounded-full bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.18em] text-center hover:bg-accent transition-colors duration-300">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ── Auth gate ── */
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-6 py-20">
        <div className="glass rounded-3xl p-10 w-full max-w-md flex flex-col items-center text-center gap-7">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock size={24} strokeWidth={1.4} className="text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl text-foreground">Sign in to checkout</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You need an account to complete your purchase. It only takes a moment.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Link href="/auth" className="w-full py-4 rounded-full bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.18em] text-center hover:bg-accent transition-colors duration-300">
              Sign in
            </Link>
            <Link href="/auth" className="w-full py-4 rounded-full border border-border text-foreground text-[11px] uppercase tracking-[0.18em] text-center hover:border-primary hover:text-primary transition-colors duration-200">
              Create account
            </Link>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={12} strokeWidth={1.5} />
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ── Order sent to WhatsApp ── */
  if (done) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-6 py-20">
        <div className="glass rounded-3xl p-10 w-full max-w-md flex flex-col items-center text-center gap-7">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle size={28} strokeWidth={1.4} className="text-emerald-600" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl text-foreground">Order sent!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your order has been sent via WhatsApp. We'll confirm and process it shortly.
            </p>
          </div>
          <div className="w-full glass rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total amount</span>
              <span className="font-medium text-foreground">{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery to</span>
              <span className="font-medium text-foreground">{form.city}, {form.state}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated delivery</span>
              <span className="font-medium text-foreground">3–5 business days</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Link href="/profile" className="w-full py-4 rounded-full bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.18em] text-center hover:bg-accent transition-colors duration-300">
              View my orders
            </Link>
            <Link href="/shop" className="w-full py-4 rounded-full border border-border text-foreground text-[11px] uppercase tracking-[0.18em] text-center hover:border-primary hover:text-primary transition-colors duration-200">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-32 md:pb-16">
      {/* ── Top bar ── */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back
          </Link>
          <Link href="/" className="font-heading text-xl tracking-[0.22em] text-foreground">CLASSIQ</Link>
          <div className="flex items-center gap-1.5">
            <MessageCircle size={12} strokeWidth={1.5} className="text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">WhatsApp checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* ══════════ LEFT COLUMN ══════════ */}
        <div className="flex flex-col gap-6">
          <div className="glass rounded-3xl p-7 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle size={20} strokeWidth={1.5} className="text-green-600" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-2xl text-foreground">WhatsApp Checkout</h2>
                <p className="text-xs text-muted-foreground">Complete your order via WhatsApp</p>
              </div>
            </div>

            {/* Error messages */}
            {errors.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800 mb-2">Please fix the following:</p>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customer info form */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
                  <User size={12} />
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleField("name")}
                  placeholder="John Doe"
                  className="w-full border border-border rounded-full px-5 py-3.5 text-sm text-foreground bg-background placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
                  <Phone size={12} />
                  Phone number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleField("phone")}
                  placeholder="+234 800 123 4567"
                  className="w-full border border-border rounded-full px-5 py-3.5 text-sm text-foreground bg-background placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
                  <Mail size={12} />
                  Email address (optional)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleField("email")}
                  placeholder="john@example.com"
                  className="w-full border border-border rounded-full px-5 py-3.5 text-sm text-foreground bg-background placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="w-full h-px bg-border my-2" />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
                  <MapPin size={12} />
                  Delivery address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={handleField("address")}
                  placeholder="Street address"
                  className="w-full border border-border rounded-full px-5 py-3.5 text-sm text-foreground bg-background placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={handleField("city")}
                    placeholder="Lagos"
                    className="w-full border border-border rounded-full px-5 py-3.5 text-sm text-foreground bg-background placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={handleField("state")}
                    placeholder="Lagos State"
                    className="w-full border border-border rounded-full px-5 py-3.5 text-sm text-foreground bg-background placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Additional notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={handleField("notes")}
                  placeholder="Any special instructions for your order..."
                  rows={3}
                  className="w-full border border-border rounded-2xl px-5 py-3.5 text-sm text-foreground bg-background placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            {/* WhatsApp checkout button */}
            <button
              onClick={handleWhatsAppCheckout}
              disabled={processing}
              className="w-full py-4 rounded-full bg-green-600 text-white text-[11px] uppercase tracking-[0.18em] hover:bg-green-700 transition-colors duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Opening WhatsApp…
                </>
              ) : (
                <>
                  <MessageCircle size={16} strokeWidth={1.5} />
                  Complete Order via WhatsApp
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              Clicking this button will open WhatsApp with your order details pre-filled. 
              Send the message to confirm your order.
            </p>
          </div>
        </div>

        {/* ══════════ RIGHT COLUMN — Order summary ══════════ */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-28">
          <div className="glass rounded-3xl p-6 flex flex-col gap-5">
            <h2 className="font-heading text-xl text-foreground">Order summary</h2>

            {/* Items */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                    <Image src={item.img} alt={item.name} fill className="object-cover" sizes="56px" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-medium">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.name}</p>
                    {item.size && (
                      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Size {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{item.color}</p>
                    )}
                  </div>
                  <p className="font-heading text-sm text-foreground shrink-0">{fmt(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-border" />

            {/* Totals */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm text-foreground">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery</span>
                <span className="text-sm text-foreground">{fmt(DELIVERY_FEE)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="font-heading text-xl text-primary">{fmt(total)}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {["Easy WhatsApp checkout", "Ships in 2–4 days", "Secure ordering"].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full border border-border text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
