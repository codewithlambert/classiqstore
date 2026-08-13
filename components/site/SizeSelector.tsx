"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { ShoeSize } from "@/lib/types";

interface SizeSelectorProps {
  sizes: ShoeSize[];
  selectedSize: ShoeSize | null;
  onSizeSelect: (size: ShoeSize) => void;
  sizeSystem?: 'US' | 'EU' | 'UK';
}

export default function SizeSelector({ 
  sizes, 
  selectedSize, 
  onSizeSelect,
  sizeSystem = 'US' 
}: SizeSelectorProps) {
  const [activeSizeSystem, setActiveSizeSystem] = useState<'US' | 'EU' | 'UK'>(sizeSystem);

  const getSizeDisplay = (size: ShoeSize): string => {
    switch (activeSizeSystem) {
      case 'US': return size.us;
      case 'EU': return size.eu;
      case 'UK': return size.uk;
      default: return size.us;
    }
  };

  const isSelected = (size: ShoeSize): boolean => {
    if (!selectedSize) return false;
    return size.us === selectedSize.us && size.eu === selectedSize.eu && size.uk === selectedSize.uk;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Size System Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Size:</span>
        <div className="flex gap-1 rounded-full bg-muted p-1">
          {(['US', 'EU', 'UK'] as const).map((system) => (
            <button
              key={system}
              type="button"
              onClick={() => setActiveSizeSystem(system)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeSizeSystem === system
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {system}
            </button>
          ))}
        </div>
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-5 gap-2">
        {sizes.map((size) => {
          const inStock = size.stock_count > 0;
          const selected = isSelected(size);
          const lowStock = size.stock_count > 0 && size.stock_count <= 3;

          return (
            <button
              key={`${size.us}-${size.eu}-${size.uk}`}
              type="button"
              onClick={() => inStock && onSizeSelect(size)}
              disabled={!inStock}
              className={`relative aspect-square rounded-2xl border-2 transition-all ${
                selected
                  ? 'border-primary bg-primary text-primary-foreground scale-105'
                  : inStock
                  ? 'border-border hover:border-primary hover:bg-primary/5'
                  : 'border-border bg-muted opacity-40 cursor-not-allowed'
              }`}
            >
              <span className={`text-sm font-medium ${!inStock && 'line-through'}`}>
                {getSizeDisplay(size)}
              </span>
              
              {selected && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
              
              {lowStock && inStock && !selected && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-1.5 py-0.5">
                  <span className="text-[9px] font-medium text-white">LOW</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Size Info */}
      {selectedSize && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-2">
          <Check size={14} className="text-green-600" />
          <span className="text-sm text-green-800">
            Size {getSizeDisplay(selectedSize)} selected
            {selectedSize.stock_count <= 3 && (
              <span className="ml-2 text-orange-600 font-medium">
                (Only {selectedSize.stock_count} left!)
              </span>
            )}
          </span>
        </div>
      )}

      {/* Size Guide Link */}
      <button
        type="button"
        className="text-xs text-primary hover:text-accent transition-colors underline text-left"
      >
        📏 View Size Guide
      </button>
    </div>
  );
}
