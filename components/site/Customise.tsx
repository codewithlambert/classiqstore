"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ArrowRight } from "lucide-react";
import { siteImages } from "@/lib/site-images";
import { useCart } from "@/store/cart";

const colors = [
  { id: "cream", hex: "#F4FAFF", label: "Cream" },
  { id: "sky", hex: "#C5D9ED", label: "Sky" },
  { id: "navy", hex: "#2F5471", label: "Navy" },
  { id: "ink", hex: "#24303D", label: "Ink" },
];

const bagTypes = [
  "Structured Tote",
  "Crossbody",
  "Evening Clutch",
  "Mini Shoulder",
];

export default function Customise() {
  const [selectedColor, setSelectedColor] = useState(colors[2].id);
  const [quantity, setQuantity] = useState(1);
  const [activeBag, setActiveBag] = useState(0);
  const { addItem } = useCart();

  function handleAddToCart() {
    const colorLabel = colors.find((c) => c.id === selectedColor)?.label ?? "Navy";
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: 99,
        name: bagTypes[activeBag],
        price: 68500,
        img: siteImages.bagMockup,
        size: "One Size",
        color: colorLabel,
      });
    }
  }

  return (
    <section className="bg-surface px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-3 md:mb-16">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Make it yours
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-foreground md:text-[2.75rem]">
            Customise until it suits you
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {/* Left — controls */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-4 text-sm text-muted-foreground">Choose colour</p>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    aria-label={c.label}
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-105 ${
                      selectedColor === c.id
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-sm text-muted-foreground">Quantity</p>
              <div className="inline-flex items-center gap-4 rounded-full border border-border bg-background px-4 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-full p-1 text-foreground/60 hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} strokeWidth={1.5} />
                </button>
                <span className="min-w-[1.5rem] text-center text-sm tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="rounded-full p-1 text-foreground/60 hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/25 px-6 py-2.5 text-sm transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Add to cart
            </button>
          </div>

          {/* Middle — product image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-full bg-background md:aspect-auto md:min-h-[420px]">
            <Image
              src="/product-3.jpg"
              alt="Product showcase"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <p className="max-w-[180px] border border-dashed border-white/70 px-4 py-3 text-center text-sm leading-relaxed text-white">
                Your initials,
                <br />
                embossed here
              </p>
            </div>
          </div>

          {/* Right — bag types */}
          <div className="flex flex-col justify-center gap-1">
            <p className="mb-4 text-sm text-muted-foreground">Bag type</p>
            {bagTypes.map((type, i) => (
              <button
                key={type}
                onClick={() => setActiveBag(i)}
                className={`flex items-center gap-3 py-3 text-left text-sm transition-colors ${
                  activeBag === i
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeBag === i && (
                  <ArrowRight size={14} strokeWidth={1.5} className="shrink-0" />
                )}
                <span className={activeBag === i ? "" : "pl-[26px]"}>{type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
