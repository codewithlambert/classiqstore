"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteImages } from "@/lib/site-images";

const products = [
  { id: 1, name: "Cream Leather Sneakers", price: "₦54,000", img: siteImages.product1, meta: "shoes" },
  { id: 2, name: "Strappy Heeled Mules", price: "₦51,500", img: siteImages.product2, meta: "shoes" },
  { id: 3, name: "Ankle Strap Heels", price: "₦58,500", img: siteImages.product3, meta: "shoes" },
  { id: 4, name: "Leather Tote Bag", price: "₦72,000", img: siteImages.product4, meta: "bags" },
];

const FILTERS = ["All", "Shoes", "Bags"];

export default function Catalog() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? products
      : products.filter((p) => p.meta.toLowerCase() === filter.toLowerCase());

  return (
    <section className="bg-background px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Header row */}
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Curated for you
            </p>
            <h2 className="font-heading text-3xl leading-tight tracking-tight text-foreground md:text-[2.75rem]">
              Our Best
              <br />
              Collections
            </h2>
          </div>

          {/* Filter pills — right aligned on desktop */}
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                  filter === f
                    ? "border-navy bg-navy text-primary-foreground"
                    : "border-border bg-transparent text-foreground/70 hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 4-up grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-full bg-surface">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-foreground">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
