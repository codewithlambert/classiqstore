"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Journal", href: "/lookbook" },
];

export default function Header() {
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState<{
    name: string;
    email: string;
    initials: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const { setOpen: openCart, count } = useCart();
  const cartCount = count();
  const isSignedIn = !!authUser;

  // Determine active section based on pathname
  const isHomeActive = pathname === "/";
  const isCartActive = false; // Cart is a drawer, not a page
  const isProfileActive = pathname === "/profile" || pathname === "/auth";

  useEffect(() => {
    const supabase = createClient();

    function setUserFromSession(
      user: { user_metadata?: { full_name?: string }; email?: string } | null
    ) {
      if (!user) {
        setAuthUser(null);
        return;
      }
      const fullName: string = user.user_metadata?.full_name ?? user.email ?? "";
      const parts = fullName.trim().split(" ");
      const initials =
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : fullName.slice(0, 2).toUpperCase();
      setAuthUser({ name: fullName, email: user.email ?? "", initials });
    }

    supabase.auth.getSession().then(({ data }) => {
      setUserFromSession(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await createClient().auth.signOut();
    setAuthUser(null);
    setProfileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <>
      {/* Desktop Header - Pill Shape with Glassmorphism */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="mx-auto px-6">
          <div className="flex items-center gap-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg px-8 py-4">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <ShoppingBag size={20} strokeWidth={1.4} className="text-foreground" />
              <span className="font-heading text-sm tracking-[0.32em] text-foreground">
                CLASSIQ
              </span>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-8">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => openCart(true)}
                className="relative rounded-full p-2.5 text-foreground/70 transition-colors hover:text-foreground"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.4} />
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[9px] font-medium text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-full p-2.5 text-foreground/70 transition-colors hover:text-foreground"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.4} />
              </button>
              <div className="relative" ref={profileRef}>
                {isSignedIn ? (
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {authUser!.initials}
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className="rounded-full p-2.5 text-foreground/70 transition-colors hover:text-foreground"
                    aria-label="Account"
                  >
                    <User size={18} strokeWidth={1.4} />
                  </Link>
                )}

                {isSignedIn && (
                  <div
                    className={`absolute right-0 top-[calc(100%+12px)] w-60 overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg transition-all duration-200 ${
                      profileOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0"
                    }`}
                  >
                    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-medium text-primary-foreground">
                        {authUser!.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{authUser!.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {authUser!.email}
                        </p>
                      </div>
                    </div>
                    {[
                      { icon: User, label: "My Profile", href: "/profile" },
                      { icon: Package, label: "My Orders", href: "/profile" },
                      { icon: Heart, label: "Wishlist", href: "/profile" },
                      { icon: Settings, label: "Settings", href: "/profile" },
                    ].map(({ icon: Icon, label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-white/5 last:border-0"
                      >
                        <Icon size={14} strokeWidth={1.5} className="text-muted-foreground" />
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50/10"
                    >
                      <LogOut size={14} strokeWidth={1.5} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Top Pill with CLASSIQ */}
      <div className="md:hidden">
        {/* Top pill header */}
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md">
          <div className="flex items-center justify-between gap-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg px-5 py-3">
            <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
              <ShoppingBag size={16} strokeWidth={1.5} className="text-foreground shrink-0" />
              <span className="font-heading text-[11px] tracking-[0.24em] text-foreground whitespace-nowrap">
                CLASSIQ
              </span>
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-foreground/70 hover:text-foreground transition-colors shrink-0"
              aria-label="Search"
            >
              <Search size={16} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Bottom pill navbar */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="relative flex items-center gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl px-6 py-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative rounded-full p-2 text-foreground/70 transition-all hover:text-foreground"
              aria-label="Menu"
            >
              {(menuOpen || isHomeActive) && (
                <span className="absolute inset-0 -z-10 animate-in fade-in zoom-in-95 duration-200 rounded-full bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_8px_rgba(0,0,0,0.1)] scale-[1.4]" />
              )}
              {menuOpen ? <X size={18} strokeWidth={1.4} className={menuOpen ? "text-foreground" : ""} /> : <Menu size={18} strokeWidth={1.4} className={isHomeActive ? "text-foreground" : ""} />}
            </button>
            <button
              onClick={() => openCart(true)}
              className="relative rounded-full p-2 text-foreground/70 transition-all hover:text-foreground"
              aria-label="Cart"
            >
              {isCartActive && (
                <span className="absolute inset-0 -z-10 animate-in fade-in zoom-in-95 duration-200 rounded-full bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_8px_rgba(0,0,0,0.1)] scale-[1.4]" />
              )}
              <ShoppingBag size={18} strokeWidth={1.4} className={isCartActive ? "text-foreground" : ""} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[9px] font-medium text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
            <Link
              href={isSignedIn ? "/profile" : "/auth"}
              className="relative rounded-full p-2 text-foreground/70 transition-all hover:text-foreground"
              aria-label="Account"
            >
              {isProfileActive && (
                <span className="absolute inset-0 -z-10 animate-in fade-in zoom-in-95 duration-200 rounded-full bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_8px_rgba(0,0,0,0.1)] scale-[1.4]" />
              )}
              {isSignedIn ? (
                <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[9px] font-medium text-primary-foreground ${isProfileActive ? "ring-2 ring-white/50" : ""}`}>
                  {authUser!.initials}
                </div>
              ) : (
                <User size={18} strokeWidth={1.4} className={isProfileActive ? "text-foreground" : ""} />
              )}
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile menu drawer with glassmorphism */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-4 bottom-24 left-4 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl transition-all duration-300 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <nav className="flex flex-col p-2">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl px-6 py-4 transition-colors hover:bg-white/10"
              >
                <span className="font-heading text-xl tracking-tight">{label}</span>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground"
                />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Search overlay with glassmorphism */}
      <div
        className={`fixed inset-0 z-[70] bg-background/80 backdrop-blur-xl transition-opacity duration-200 ${searchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="flex items-center gap-3 px-5 pb-4 pt-5">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-4">
            <Search size={16} strokeWidth={1.4} className="shrink-0 text-muted-foreground" />
            <input
              autoFocus={searchOpen}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shoes, bags..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setSearchOpen(false);
              setQuery("");
            }}
            className="shrink-0 text-sm text-foreground"
          >
            Cancel
          </button>
        </div>
        {query && (
          <div className="px-5">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Results for &quot;{query}&quot;
            </p>
            <Link
              href="/shop"
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
              className="block rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-4 text-sm text-foreground transition-colors hover:bg-white/20"
            >
              Browse all products
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
