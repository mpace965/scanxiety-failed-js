const products = [
  { id: 'notebook', name: 'Notebook', price: 1200, stock: 20, category: 'stationery' },
  { id: 'pen', name: 'Pen', price: 250, stock: 50, category: 'stationery' },
  { id: 'mug', name: 'Coffee mug', price: 1800, stock: 12, category: 'kitchen' },
  { id: 'bottle', name: 'Water bottle', price: 2400, stock: 8, category: 'kitchen' },
];

export function listProducts(category) {
  return products
    .filter((product) => category === undefined || product.category === category)
    .map((product) => ({ ...product }));
}

export function findProduct(id) {
  const product = products.find((candidate) => candidate.id === id);
  if (product === undefined) {
    throw new Error(`Unknown product: ${id}`);
  }
  return { ...product };
}

export function searchProducts(query) {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return listProducts();
  }
  return listProducts().filter((product) => product.name.toLowerCase().includes(normalized));
}

export function reserveStock(items) {
  const quantities = new Map();
  for (const item of items) {
    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
      throw new Error('Stock reservations require positive integer quantities.');
    }
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }
  for (const [id, quantity] of quantities) {
    const product = findProduct(id);
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
  }
  for (const [id, quantity] of quantities) {
    const product = products.find((candidate) => candidate.id === id);
    product.stock -= quantity;
  }
}

export function catalogSummary() {
  const categories = new Map();
  for (const product of products) {
    const current = categories.get(product.category) ?? { products: 0, units: 0, value: 0 };
    current.products += 1;
    current.units += product.stock;
    current.value += product.stock * product.price;
    categories.set(product.category, current);
  }
  return Object.fromEntries(categories);
}
