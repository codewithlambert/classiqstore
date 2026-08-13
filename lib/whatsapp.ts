// ═══════════════════════════════════════════════════════════════
// WHATSAPP CHECKOUT UTILITY
// ═══════════════════════════════════════════════════════════════

import type { CartItem, WhatsAppCheckoutData } from './types';

/**
 * Format currency for Nigerian Naira
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate WhatsApp message for checkout
 */
export function generateWhatsAppMessage(data: WhatsAppCheckoutData): string {
  const { items, total, customerName, customerPhone, customerEmail, shippingAddress, notes } = data;

  let message = `🛍️ *NEW ORDER FROM CLASSIQ*\n\n`;
  message += `👤 *Customer Details*\n`;
  message += `Name: ${customerName}\n`;
  message += `Phone: ${customerPhone}\n`;
  if (customerEmail) {
    message += `Email: ${customerEmail}\n`;
  }
  message += `\n📍 *Shipping Address*\n${shippingAddress}\n\n`;

  message += `🛒 *Order Items*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;

  items.forEach((item, index) => {
    message += `\n${index + 1}. *${item.name}*\n`;
    message += `   ${formatNaira(item.price)} x ${item.quantity}\n`;
    
    if (item.attributes?.size) {
      message += `   Size: ${item.attributes.size.display}\n`;
    }
    if (item.attributes?.width) {
      message += `   Width: ${item.attributes.width}\n`;
    }
    if (item.attributes?.color) {
      message += `   Color: ${item.attributes.color}\n`;
    }
    if (item.size) { // legacy support
      message += `   Size: ${item.size}\n`;
    }
    if (item.color) { // legacy support
      message += `   Color: ${item.color}\n`;
    }
    
    const itemTotal = item.price * item.quantity;
    message += `   Subtotal: ${formatNaira(itemTotal)}\n`;
  });

  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL: ${formatNaira(total)}*\n`;

  if (notes) {
    message += `\n📝 *Additional Notes*\n${notes}\n`;
  }

  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ Thank you for shopping with CLASSIQ!\n`;
  message += `We'll confirm your order shortly.`;

  return message;
}

/**
 * Create WhatsApp checkout URL
 */
export function createWhatsAppCheckoutUrl(data: WhatsAppCheckoutData, whatsappNumber: string): string {
  const message = generateWhatsAppMessage(data);
  const encodedMessage = encodeURIComponent(message);
  
  // Remove any + or spaces from the phone number
  const cleanNumber = whatsappNumber.replace(/[\s+]/g, '');
  
  // Create WhatsApp URL
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    return `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`;
  } else {
    return `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
  }
}

/**
 * Open WhatsApp checkout
 */
export function openWhatsAppCheckout(data: WhatsAppCheckoutData, whatsappNumber: string = '+2348022705826'): void {
  const url = createWhatsAppCheckoutUrl(data, whatsappNumber);
  window.open(url, '_blank');
}

/**
 * Validate checkout data
 */
export function validateCheckoutData(data: Partial<WhatsAppCheckoutData>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.customerName || data.customerName.trim().length === 0) {
    errors.push('Customer name is required');
  }

  if (!data.customerPhone || data.customerPhone.trim().length === 0) {
    errors.push('Phone number is required');
  } else if (!/^[\d\s+()-]+$/.test(data.customerPhone)) {
    errors.push('Invalid phone number format');
  }

  if (!data.shippingAddress || data.shippingAddress.trim().length === 0) {
    errors.push('Shipping address is required');
  }

  if (!data.items || data.items.length === 0) {
    errors.push('Cart is empty');
  }

  if (!data.total || data.total <= 0) {
    errors.push('Invalid order total');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get WhatsApp number from settings
 */
export async function getWhatsAppNumber(): Promise<string> {
  try {
    const response = await fetch('/api/settings/whatsapp_number');
    const data = await response.json();
    return data.value || '+2348022705826'; // fallback
  } catch (error) {
    console.error('Failed to fetch WhatsApp number:', error);
    return '+2348022705826'; // fallback
  }
}
