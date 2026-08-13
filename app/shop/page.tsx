"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { useCart } from "@/store/cart";

const allProducts = [
  // Shoes
  { id: 1, name: "Classic Black Heels",       price: "₦45,000", priceNum: 45000,  img: "/shoe-1.jpg", badge: "Bestseller", meta: "Heels",        occasions: ["event","work"], productType: "shoe" },
  { id: 2, name: "Strappy Evening Sandals",   price: "₦52,000", priceNum: 52000,  img: "/shoe-2.jpg", badge: "New",        meta: "Sandals",      occasions: ["event"], productType: "shoe" },
  { id: 3, name: "Pointed Toe Mules",         price: "₦38,500", priceNum: 38500,  img: "/shoe-3.jpg", badge: "New",        meta: "Mules",        occasions: ["work","casual"], productType: "shoe" },
  { id: 4, name: "Ankle Strap Block Heels",   price: "₦48,000", priceNum: 48000,  img: "/shoe-4.jpg", badge: "Bestseller", meta: "Heels",        occasions: ["event","work"], productType: "shoe" },
  { id: 5, name: "Metallic Platform Heels",   price: "₦56,000", priceNum: 56000,  img: "/shoe-5.jpg", badge: "New",        meta: "Heels",        occasions: ["event"], productType: "shoe" },
  { id: 6, name: "Elegant Kitten Heels",      price: "₦42,000", priceNum: 42000,  img: "/shoe-6.jpg", badge: "New",        meta: "Heels",        occasions: ["work","event","casual"], productType: "shoe" },
  
  // Bags
  { id: 7,  name: "Classic Leather Tote",     price: "₦68,000", priceNum: 68000,  img: "/bag-1.jpg", badge: "Bestseller", meta: "Tote Bags",    occasions: ["work","casual","weekend"], productType: "bag" },
  { id: 8,  name: "Crossbody Chain Bag",      price: "₦54,000", priceNum: 54000,  img: "/bag-2.jpg", badge: "New",        meta: "Crossbody Bags", occasions: ["event","casual"], productType: "bag" },
  { id: 9,  name: "Structured Shoulder Bag",  price: "₦72,000", priceNum: 72000,  img: "/bag-3.jpg", badge: "New",        meta: "Shoulder Bags", occasions: ["work","event"], productType: "bag" },
  { id: 10, name: "Evening Clutch",           price: "₦38,000", priceNum: 38000,  img: "/bag-4.jpg", badge: "New",        meta: "Clutches",     occasions: ["event"], productType: "bag" },
  { id: 11, name: "Mini Bucket Bag",          price: "₦46,000", priceNum: 46000,  img: "/bag-5.jpg", badge: "Bestseller", meta: "Mini Bags",    occasions: ["casual","weekend"], productType: "bag" },
  { id: 12, name: "Hobo Shoulder Bag",        price: "₦62,000", priceNum: 62000,  img: "/bag-6.jpg", badge: "New",        meta: "Hobo Bags",    occasions: ["casual","weekend","work"], productType: "bag" },
];

const occasionLabels: Record<string, string> = {
  work: "Work", weekend: "Weekend", event: "Event", casual: "Casual",
};

const categories = ["All", "Shoes", "Bags", "Heels", "Sandals", "Mules", "Tote Bags", "Crossbody Bags", "Shoulder Bags", "Clutches"];

function ShopContent() {
  const searchParams = useSearchParams();
  const occasion = searchParams.get("occasion") ?? "";
  const { addItem, setOpen } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeOccasion, setActiveOccasion] = useState(occasion);
  const [showFilters, setShowFilters] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => { setActiveOccasion(occasion); }, [occasion]);

  const filtered = allProducts.filter((p) => {
    // Category matching: handle top-level (Shoes/Bags) and specific subcategories
    let catMatch = activeCategory === "All";
    if (!catMatch) {
      if (activeCategory === "Shoes") {
        catMatch = p.productType === "shoe";
      } else if (activeCategory === "Bags") {
        catMatch = p.productType === "bag";
      } else {
        catMatch = p.meta === activeCategory;
      }
    }
    const occMatch = !activeOccasion || p.occasions.includes(activeOccasion);
    return catMatch && occMatch;
  });

  function handleQuickAdd(p: typeof allProducts[0]) {
    addItem({ id: p.id, name: p.name, price: p.priceNum, img: p.img, size: "M", color: "#ffffff" });
    setAddedId(p.id);
    setOpen(true);
    setTimeout(() => setAddedId(null), 2000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">

        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary mb-2">
            {activeOccasion ? `Occasion — ${occasionLabels[activeOccasion] ?? activeOccasion}` : "All Products"}
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-4xl md:text-5xl">
              {activeOccasion ? occasionLabels[activeOccasion] : "Shop"}
            </h1>
            <button onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-[11px] uppercase tracking-[0.14em] text-foreground hover:border-primary hover:text-primary transition-colors">
              <SlidersHorizontal size={13} strokeWidth={1.5} />
              {showFilters ? "Hide" : "Filter"}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {(activeOccasion || activeCategory !== "All") && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeOccasion && (
              <button onClick={() => setActiveOccasion("")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.12em]">
                {occasionLabels[activeOccasion]} <X size={10} />
              </button>
            )}
            {activeCategory !== "All" && (
              <button onClick={() => setActiveCategory("All")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.12em]">
                {activeCategory} <X size={10} />
              </button>
            )}
          </div>
        )}

        {/* Filter panel */}
        {showFilters && (
          <div className="glass rounded-2xl p-6 mb-8 flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button key={c} onClick={() => setActiveCategory(c)}
                    className={`px-4 py-2 rounded-full border text-[11px] uppercase tracking-[0.12em] transition-all ${
                      activeCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Occasion</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(occasionLabels).map(([slug, label]) => (
                  <button key={slug} onClick={() => setActiveOccasion(activeOccasion === slug ? "" : slug)}
                    className={`px-4 py-2 rounded-full border text-[11px] uppercase tracking-[0.12em] transition-all ${
                      activeOccasion === slug ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-muted-foreground">No products found.</p>
            <button onClick={() => { setActiveCategory("All"); setActiveOccasion(""); }}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.14em] hover:bg-accent transition-colors">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <div key={p.id} className="glass glass-lift rounded-full overflow-hidden flex flex-col group">
                <Link href={`/products/${p.id}`} className="relative aspect-[3/4] overflow-hidden bg-muted block">
                  <Image src={p.img} alt={p.name} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" sizes="25vw" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] rounded-full font-medium ${
                    p.badge === "New" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                  }`}>{p.badge}</span>
                </Link>
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{p.meta}</p>
                  <Link href={`/products/${p.id}`} className="text-sm text-foreground hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">{p.name}</Link>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-display text-base text-foreground">{p.price}</p>
                    <button onClick={() => handleQuickAdd(p)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        addedId === p.id ? "bg-accent text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-accent"
                      }`}>
                      <ShoppingBag size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
