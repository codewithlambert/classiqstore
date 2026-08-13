"use client";

import { useState } from "react";
import Link from "next/link";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/emails/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      /* still show success for UX */
    }
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="bg-navy text-primary-foreground">
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col items-center gap-10 text-center">
          <h2 className="font-heading max-w-lg text-3xl leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
            Step into style. Subscribe for exclusive offers.
          </h2>

          {subscribed ? (
            <p className="text-sm text-primary-foreground/70">
              You&apos;re subscribed. Welcome to CLASSIQ.
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/5 p-1.5"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-primary-foreground px-6 py-2.5 text-sm font-medium text-navy transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Links Section */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Shop */}
            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/50">
                Shop
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/shop?category=Shoes"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    All Shoes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Bags"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    All Bags
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Heels"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Heels
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?occasion=event"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Evening Wear
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/50">
                Customer Care
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/50">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lookbook"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Lookbook
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/50">
                Connect
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/2348022705826"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 md:flex-row md:px-8">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} CLASSIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/50 transition-colors hover:text-primary-foreground"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/50 transition-colors hover:text-primary-foreground"
              aria-label="X"
            >
              <XIcon size={16} />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/50 transition-colors hover:text-primary-foreground"
              aria-label="Facebook"
            >
              <FacebookIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
