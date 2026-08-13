# 🚀 CLASSIQ Shoes & Bags Implementation Guide

## What's Been Done

### ✅ 1. Database Migration Script Created
- **File**: `shoes-bags-migration.sql`
- **What it does**:
  - Adds `product_type` column to products (shoe/bag)
  - Adds `metadata` JSONB column for shoe/bag specific attributes
  - Creates `categories` table with hierarchical structure
  - Seeds 9 shoe categories (Heels, Flats, Sneakers, Boots, etc.)
  - Seeds 9 bag categories (Tote, Shoulder, Crossbody, Clutch, etc.)
  - Migrates existing products to shoes or bags based on keywords
  - Adds WhatsApp settings for checkout

### ✅ 2. TypeScript Types Updated
- **File**: `lib/types.ts`
- **New types**:
  - `ProductType` (shoe | bag)
  - `ShoeMetadata` with sizes, materials, heel height, etc.
  - `BagMetadata` with dimensions, strap type, compartments, etc.
  - `Category` with hierarchical structure
  - `WhatsAppCheckoutData` for checkout flow
  - `CartItemAttributes` for size/color/material selection

### ✅ 3. WhatsApp Checkout Utility
- **File**: `lib/whatsapp.ts`
- **Functions**:
  - `generateWhatsAppMessage()` - Creates formatted order message
  - `createWhatsAppCheckoutUrl()` - Generates WhatsApp URL
  - `openWhatsAppCheckout()` - Opens WhatsApp with order details
  - `validateCheckoutData()` - Validates customer info before checkout
  - `getWhatsAppNumber()` - Fetches store's WhatsApp number

## 📋 Next Steps to Complete

### Step 1: Run Database Migration
```bash
# Open Supabase Dashboard → SQL Editor
# Copy and paste contents of shoes-bags-migration.sql
# Click "Run" to execute the migration
```

### Step 2: Update Checkout Page
The checkout needs to be updated to use WhatsApp instead of traditional payment:
- Replace payment form with customer info form
- Add "Complete Order via WhatsApp" button
- Use `openWhatsAppCheckout()` function

### Step 3: Create Size Selector Component
For shoe products, create:
- Size selector with US/EU/UK toggle
- Width selector (Narrow/Regular/Wide)
- Stock availability indicator per size

### Step 4: Update Product Detail Pages
- Show product_type specific information
- For shoes: display sizes, heel height, material
- For bags: display dimensions, strap type, compartments
- Show appropriate add-to-cart with size selection for shoes

### Step 5: Implement Filtering
- Category filters (Heels, Flats, Tote, Crossbody, etc.)
- Shoe-specific filters (heel height, size, width)
- Bag-specific filters (size category, strap type)
- Occasion filters (Work, Casual, Evening, etc.)

## 🎯 Priority Order

1. **Run migration** (5 minutes)
2. **Update checkout to WhatsApp** (30 minutes)
3. **Create size selector** (1 hour)
4. **Update product details** (1 hour)
5. **Add filtering UI** (2 hours)

## 📞 WhatsApp Checkout Flow

### Current Implementation
```typescript
import { openWhatsAppCheckout } from '@/lib/whatsapp';

// In your checkout page:
const handleCheckout = () => {
  const checkoutData = {
    items: cartItems,
    total: cartTotal,
    customerName: form.name,
    customerPhone: form.phone,
    customerEmail: form.email,
    shippingAddress: form.address,
    notes: form.notes,
  };
  
  openWhatsAppCheckout(checkoutData);
};
```

### What Happens
1. Customer fills out simple form (name, phone, address)
2. Clicks "Complete Order via WhatsApp"
3. Opens WhatsApp with pre-filled message containing:
   - Customer details
   - All ordered items with sizes/colors
   - Total amount
   - Shipping address
4. Customer sends message to your business WhatsApp
5. You confirm and process the order manually

## 🔧 Configuration

### Update WhatsApp Number
```sql
-- In Supabase SQL Editor
UPDATE settings 
SET value = '+234YOUR_WHATSAPP_NUMBER' 
WHERE key = 'whatsapp_number';
```

### Test Mode
Use `+2348012345678` (default) for testing, then update to your real number.

## 📦 Database Structure

### Products Table
```
- id (uuid)
- name (text)
- price (numeric)
- product_type (varchar) ← NEW: 'shoe' or 'bag'
- metadata (jsonb) ← NEW: shoe/bag specific data
- category_id (int) ← NEW: references categories
- images (jsonb)
- stock_count (int)
```

### Categories Table (NEW)
```
- id (serial)
- name (text)
- slug (text)
- parent_category ('shoes' or 'bags')
- product_type ('shoe' or 'bag')
- display_order (int)
```

## 🎨 UI Components Needed

### 1. Size Selector (for shoes)
```tsx
<SizeSelector 
  sizes={product.metadata.sizes}
  onSelect={(size) => setSelectedSize(size)}
  sizeSystem="US" // or EU, UK
/>
```

### 2. Product Type Badge
```tsx
{product.product_type === 'shoe' ? '👠 Shoe' : '👜 Bag'}
```

### 3. WhatsApp Checkout Button
```tsx
<button onClick={() => openWhatsAppCheckout(checkoutData)}>
  📱 Complete Order via WhatsApp
</button>
```

## ✨ Features Ready to Use

- ✅ Database schema for shoes & bags
- ✅ TypeScript types
- ✅ WhatsApp checkout utility
- ✅ Category hierarchy
- ✅ Product metadata structure
- ✅ Size/dimension support

## 🚧 Features Still Needed

- ⏳ Size selector component
- ⏳ WhatsApp checkout UI
- ⏳ Product type-specific display
- ⏳ Advanced filtering
- ⏳ Admin product editor for shoes/bags

---

**Ready to implement?** Start with Step 1 (database migration) and then move to checkout!
