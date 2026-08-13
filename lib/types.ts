// ═══════════════════════════════════════════════════════════════
// CLASSIQ TYPE DEFINITIONS - Shoes & Bags E-Commerce
// ═══════════════════════════════════════════════════════════════

export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ProductCategory =
  | "beanie"
  | "skirt"
  | "set"
  | "bag"
  | "accessory"
  | "shorts"
  | "baby_wear"
  | "shoe"; // Added shoe

export type CustomRequestStatus =
  | "pending"
  | "in_progress"
  | "quoted"
  | "accepted"
  | "completed";

export type InsightType = "alert" | "opportunity" | "content";
export type AssistantMode = "chat" | "insight" | "plan" | "content";

// ─── NEW: PRODUCT TYPES FOR SHOES & BAGS ─────────────────────────
export type ProductType = 'shoe' | 'bag';

export type ShoeStyle = 
  | 'Heels' 
  | 'Flats' 
  | 'Sneakers' 
  | 'Boots' 
  | 'Sandals' 
  | 'Wedges' 
  | 'Mules' 
  | 'Loafers'
  | 'Espadrilles';

export type BagStyle = 
  | 'Tote' 
  | 'Shoulder Bag' 
  | 'Crossbody' 
  | 'Clutch' 
  | 'Backpack' 
  | 'Satchel' 
  | 'Hobo' 
  | 'Bucket Bag'
  | 'Belt Bag'
  | 'Mini Bag';

export type Occasion = 'Work' | 'Casual' | 'Evening' | 'Weekend' | 'Travel' | 'Bridal';

export interface ShoeSize {
  us: string;
  eu: string;
  uk: string;
  stock_count: number;
}

export interface ShoeMetadata {
  sizes: ShoeSize[];
  size_system?: 'US' | 'EU' | 'UK';
  width_options?: ('Narrow' | 'Regular' | 'Wide')[];
  heel_height?: number; // in cm
  heel_type?: 'Flat' | 'Kitten' | 'Mid' | 'High' | 'Platform' | 'Wedge';
  material: string[];
  color: string;
  style: ShoeStyle;
  occasion: Occasion[];
  toe_shape?: 'Pointed' | 'Round' | 'Square' | 'Almond' | 'Open';
  closure_type?: 'Lace-up' | 'Slip-on' | 'Buckle' | 'Zipper' | 'Velcro';
  sole_material?: string;
  is_waterproof?: boolean;
}

export interface BagMetadata {
  dimensions: {
    width: number;  // cm
    height: number; // cm
    depth: number;  // cm
  };
  capacity?: string;
  weight?: number;
  material: string[];
  color: string;
  style: BagStyle;
  occasion: Occasion[];
  strap_type: 'Shoulder' | 'Crossbody' | 'Handle' | 'Detachable' | 'Adjustable';
  strap_drop?: number;
  closure_type: 'Zipper' | 'Magnetic' | 'Flap' | 'Drawstring' | 'Open';
  compartments: number;
  has_laptop_sleeve?: boolean;
  hardware_color?: 'Gold' | 'Silver' | 'Rose Gold' | 'Gunmetal';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_category?: 'shoes' | 'bags';
  product_type: ProductType;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── UPDATED PRODUCT INTERFACE ────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  stock_count: number;
  category?: ProductCategory; // legacy
  category_id?: number;
  description: string | null;
  images: string[];
  size_prices: { size: string; price: number }[];
  is_flash_sale: boolean;
  flash_sale_price: number | null;
  created_at: string;
  
  // New fields
  product_type: ProductType;
  metadata: ShoeMetadata | BagMetadata;
}

// ─── PROFILE ──────────────────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  created_at: string;
}

// ─── ORDERS ───────────────────────────────────────────────────────
export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  items: { product_id: string; name: string; quantity: number; price: number; size: string }[];
  created_at: string;
  profiles?: { full_name: string | null; email: string | null };
}

// ─── CUSTOM REQUESTS ──────────────────────────────────────────────
export interface CustomRequest {
  id: string;
  user_id: string;
  product_type: string | null;
  description: string | null;
  reference_images: string[];
  status: CustomRequestStatus;
  quote_amount: number | null;
  created_at: string;
  profiles?: { full_name: string | null; email: string | null };
}

// ─── SUBSCRIBERS ──────────────────────────────────────────────────
export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

// ─── LOOKBOOK ─────────────────────────────────────────────────────
export interface LookbookEntry {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  published: boolean;
  created_at: string;
}

// ─── ASSISTANT ────────────────────────────────────────────────────
export interface Insight {
  type: InsightType;
  title: string;
  body: string;
  action: string;
  actionHref: string;
  urgent: boolean;
}

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── CART TYPES ───────────────────────────────────────────────────
export interface CartItemAttributes {
  size?: {
    us: string;
    eu: string;
    uk: string;
    display: string;
  };
  width?: 'Narrow' | 'Regular' | 'Wide';
  color: string;
  material?: string;
  strap_style?: 'Shoulder' | 'Crossbody' | 'Handle';
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  img: string;
  quantity: number;
  product_type?: ProductType;
  attributes?: CartItemAttributes;
  size?: string; // legacy
  color?: string; // legacy
}

// ─── WHATSAPP CHECKOUT ────────────────────────────────────────────
export interface WhatsAppCheckoutData {
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  notes?: string;
}
