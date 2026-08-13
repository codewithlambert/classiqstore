"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, Star } from "lucide-react";
import { useCart } from "@/store/cart";

const allProducts = [
  // Shoes
  { 
    id: 1, 
    name: "Classic Black Heels", 
    price: "₦45,000", 
    priceNum: 45000, 
    img: "/shoe-1.jpg", 
    badge: "Bestseller", 
    meta: "Heels",
    productType: "shoe",
    swatches: ["#000000","#8b4513","#c0c0c0"], 
    sizes: ["36","37","38","39","40","41"], 
    description: "Timeless black heels with a pointed toe and 8cm stiletto heel. Crafted from premium leather with cushioned insoles for all-day comfort. Perfect for the office or evening events.",
    rating: 4.8,
    reviewCount: 156
  },
  { 
    id: 2, 
    name: "Strappy Evening Sandals", 
    price: "₦52,000", 
    priceNum: 52000, 
    img: "/shoe-2.jpg", 
    badge: "New", 
    meta: "Sandals",
    productType: "shoe",
    swatches: ["#ffd700","#c0c0c0","#000000"], 
    sizes: ["36","37","38","39","40"], 
    description: "Elegant strappy sandals with delicate ankle wraps and a 9cm heel. Features metallic accents and a padded footbed. Your go-to for special occasions.",
    rating: 4.9,
    reviewCount: 89
  },
  { 
    id: 3, 
    name: "Pointed Toe Mules", 
    price: "₦38,500", 
    priceNum: 38500, 
    img: "/shoe-3.jpg", 
    badge: "New", 
    meta: "Mules",
    productType: "shoe",
    swatches: ["#d2691e","#000000","#ffffff"], 
    sizes: ["36","37","38","39","40","41"], 
    description: "Chic slide-on mules with a sharp pointed toe and 5cm kitten heel. Made from supple leather, perfect for transitioning from work to weekend.",
    rating: 4.7,
    reviewCount: 124
  },
  { 
    id: 4, 
    name: "Ankle Strap Block Heels", 
    price: "₦48,000", 
    priceNum: 48000, 
    img: "/shoe-4.jpg", 
    badge: "Bestseller", 
    meta: "Heels",
    productType: "shoe",
    swatches: ["#8b4513","#000000","#c0c0c0"], 
    sizes: ["36","37","38","39","40","41"], 
    description: "Sturdy block heels with an elegant ankle strap. The 7cm heel provides stability while the pointed toe adds sophistication. Versatile enough for any occasion.",
    rating: 4.9,
    reviewCount: 203
  },
  { 
    id: 5, 
    name: "Metallic Platform Heels", 
    price: "₦56,000", 
    priceNum: 56000, 
    img: "/shoe-5.jpg", 
    badge: "New", 
    meta: "Heels",
    productType: "shoe",
    swatches: ["#c0c0c0","#ffd700","#000000"], 
    sizes: ["36","37","38","39","40"], 
    description: "Show-stopping metallic heels with a 3cm platform and 11cm heel. Features a glamorous finish and padded insoles. Make a statement at any event.",
    rating: 4.6,
    reviewCount: 78
  },
  { 
    id: 6, 
    name: "Elegant Kitten Heels", 
    price: "₦42,000", 
    priceNum: 42000, 
    img: "/shoe-6.jpg", 
    badge: "New", 
    meta: "Heels",
    productType: "shoe",
    swatches: ["#ffe4e1","#000000","#c0c0c0"], 
    sizes: ["36","37","38","39","40","41"], 
    description: "Classic kitten heels with a 4cm heel and pointed toe. Comfortable enough for all-day wear while maintaining an elegant silhouette. A wardrobe essential.",
    rating: 4.8,
    reviewCount: 167
  },
  
  // Bags
  { 
    id: 7, 
    name: "Classic Leather Tote", 
    price: "₦68,000", 
    priceNum: 68000, 
    img: "/bag-1.jpg", 
    badge: "Bestseller", 
    meta: "Tote Bags",
    productType: "bag",
    swatches: ["#8b4513","#000000","#d2691e"], 
    sizes: ["One Size"], 
    description: "Spacious leather tote with reinforced handles and interior pockets. Dimensions: 38cm x 32cm x 12cm. Perfect for work, travel, or everyday essentials.",
    rating: 4.9,
    reviewCount: 245
  },
  { 
    id: 8, 
    name: "Crossbody Chain Bag", 
    price: "₦54,000", 
    priceNum: 54000, 
    img: "/bag-2.jpg", 
    badge: "New", 
    meta: "Crossbody Bags",
    productType: "bag",
    swatches: ["#000000","#c0c0c0","#8b4513"], 
    sizes: ["One Size"], 
    description: "Compact crossbody with gold-tone chain strap. Features quilted leather and a magnetic closure. Dimensions: 22cm x 15cm x 7cm. Ideal for evenings out.",
    rating: 4.7,
    reviewCount: 132
  },
  { 
    id: 9, 
    name: "Structured Shoulder Bag", 
    price: "₦72,000", 
    priceNum: 72000, 
    img: "/bag-3.jpg", 
    badge: "New", 
    meta: "Shoulder Bags",
    productType: "bag",
    swatches: ["#000000","#ffffff","#8b4513"], 
    sizes: ["One Size"], 
    description: "Polished structured bag with a detachable shoulder strap. Multiple compartments and metal hardware. Dimensions: 30cm x 22cm x 10cm. Professional and chic.",
    rating: 4.8,
    reviewCount: 178
  },
  { 
    id: 10, 
    name: "Evening Clutch", 
    price: "₦38,000", 
    priceNum: 38000, 
    img: "/bag-4.jpg", 
    badge: "New", 
    meta: "Clutches",
    productType: "bag",
    swatches: ["#ffd700","#c0c0c0","#000000"], 
    sizes: ["One Size"], 
    description: "Sleek evening clutch with metallic finish and chain detail. Dimensions: 25cm x 14cm x 5cm. Holds essentials for special occasions. Features detachable chain strap.",
    rating: 4.6,
    reviewCount: 94
  },
  { 
    id: 11, 
    name: "Mini Bucket Bag", 
    price: "₦46,000", 
    priceNum: 46000, 
    img: "/bag-5.jpg", 
    badge: "Bestseller", 
    meta: "Mini Bags",
    productType: "bag",
    swatches: ["#d2691e","#000000","#ffffff"], 
    sizes: ["One Size"], 
    description: "Trendy mini bucket bag with drawstring closure and crossbody strap. Dimensions: 18cm x 20cm x 10cm. Compact yet spacious for everyday essentials.",
    rating: 4.8,
    reviewCount: 201
  },
  { 
    id: 12, 
    name: "Hobo Shoulder Bag", 
    price: "₦62,000", 
    priceNum: 62000, 
    img: "/bag-6.jpg", 
    badge: "New", 
    meta: "Hobo Bags",
    productType: "bag",
    swatches: ["#8b4513","#000000","#d2691e"], 
    sizes: ["One Size"], 
    description: "Relaxed hobo bag with slouchy silhouette and magnetic snap closure. Dimensions: 35cm x 28cm x 8cm. Casual elegance for weekend outings.",
    rating: 4.7,
    reviewCount: 143
  },
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const product = allProducts.find((p) => p.id === Number(id)) ?? allProducts[0];
  
  // Show related products of the same type (shoes with shoes, bags with bags)
  const related = allProducts
    .filter((p) => p.id !== product.id && p.productType === product.productType)
    .slice(0, 4);

  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSwatch, setSelectedSwatch] = useState(product.swatches[0]);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.priceNum,
      img: product.img,
      size: selectedSize,
      color: selectedSwatch,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors duration-200">
          <ArrowLeft size={13} strokeWidth={1.5} />
          Back to shop
        </Link>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Image */}
        <div className="glass rounded-2xl overflow-hidden relative aspect-[3/4] w-full">
          <Image src={product.img} alt={product.name} fill className="object-cover" sizes="50vw" priority />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] rounded-full font-medium ${
              product.badge === "New" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
            }`}>
              {product.badge}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-7 md:pt-4">

          {/* Meta + title */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{product.meta}</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-[-0.01em]">{product.name}</h1>
            <p className="font-display text-2xl text-primary mt-1">{product.price}</p>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} className={i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1 uppercase tracking-[0.14em]">{product.rating} · {product.reviewCount} reviews</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="w-full h-px bg-border" />

          {/* Colour swatches */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Colour</p>
            <div className="flex gap-2">
              {product.swatches.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedSwatch(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${
                    selectedSwatch === color ? "border-primary scale-110" : "border-border/60 hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Size</p>
              <button className="text-[10px] uppercase tracking-[0.18em] text-accent underline underline-offset-2">Size guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.14em] border transition-all duration-150 ${
                    selectedSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground hover:border-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                added
                  ? "bg-accent text-primary-foreground"
                  : "bg-primary text-primary-foreground hover:bg-accent"
              }`}
            >
              <ShoppingBag size={15} strokeWidth={1.5} />
              {added ? "Added to bag ✓" : !selectedSize ? "Select a size" : "Add to bag"}
            </button>
            <button
              onClick={() => setWished((w) => !w)}
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-200 ${
                wished ? "border-primary bg-primary/5" : "border-border hover:border-primary"
              }`}
            >
              <Heart size={18} strokeWidth={1.4} className={wished ? "fill-primary text-primary" : "text-foreground"} />
            </button>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2">
            {["Free returns", "Secure checkout", "Ships in 2–4 days"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full border border-border text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl tracking-[-0.01em]">You may also like</h2>
          <Link href="/" className="px-5 py-2 rounded-full border border-foreground text-[10px] uppercase tracking-[0.18em] text-foreground hover:bg-foreground hover:text-background transition-colors duration-200">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="glass glass-lift rounded-full overflow-hidden flex flex-col group">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image src={p.img} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" sizes="25vw" />
              </div>
              <div className="p-4 flex flex-col gap-1">
                <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{p.meta}</p>
                <p className="text-sm text-foreground">{p.name}</p>
                <p className="font-display text-base text-foreground">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
