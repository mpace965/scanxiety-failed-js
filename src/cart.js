import { findProduct, reserveStock } from './catalog.js';

export function createCart(customerId) {
  if (typeof customerId !== 'string' || customerId.trim().length === 0) {
    throw new Error('A customer ID is required.');
  }
  return { customerId, items: [], discountPercent: 0, checkedOut: false };
}

function ensureOpen(cart) {
  if (cart.checkedOut) {
    throw new Error('This cart has already been checked out.');
  }
}

export function addItem(cart, productId, quantity = 1) {
  ensureOpen(cart);
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive integer.');
  }
  const product = findProduct(productId);
  const existing = cart.items.find((item) => item.productId === productId);
  const totalQuantity = (existing?.quantity ?? 0) + quantity;
  if (totalQuantity > product.stock) {
    throw new Error(`Insufficient stock for ${product.name}`);
  }
  if (existing !== undefined) {
    existing.quantity = totalQuantity;
  } else {
    cart.items.push({ productId, name: product.name, unitPrice: product.price, quantity });
  }
  return cart;
}

export function removeItem(cart, productId) {
  ensureOpen(cart);
  cart.items = cart.items.filter((item) => item.productId !== productId);
  return cart;
}

export function applyDiscount(cart, percent) {
  ensureOpen(cart);
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error('Discount must be between 0 and 100.');
  }
  cart.discountPercent = percent;
  return cart;
}

export function calculateTotals(cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = Math.round((subtotal * cart.discountPercent) / 100);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.08);
  const shipping = taxable === 0 || taxable >= 5000 ? 0 : 500;
  return { subtotal, discount, tax, shipping, total: taxable + tax + shipping };
}

export function checkout(cart) {
  ensureOpen(cart);
  if (cart.items.length === 0) {
    throw new Error('Cannot check out an empty cart.');
  }
  reserveStock(cart.items);
  const totals = calculateTotals(cart);
  cart.checkedOut = true;
  return {
    customerId: cart.customerId,
    items: cart.items.map((item) => ({ ...item })),
    totals,
    status: 'confirmed',
  };
}
