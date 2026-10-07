import { addItem, applyDiscount, checkout, createCart } from './cart.js';
import { catalogSummary, listProducts, searchProducts } from './catalog.js';
import { formatReceipt, summarizeOrders } from './receipt.js';

function runDemo() {
  console.log('Available products:', listProducts());
  console.log('Search for notebook:', searchProducts('notebook'));

  const firstCart = createCart('customer-001');
  addItem(firstCart, 'notebook', 2);
  addItem(firstCart, 'pen', 3);
  applyDiscount(firstCart, 10);
  const firstOrder = checkout(firstCart);
  console.log(formatReceipt(firstOrder));

  const secondCart = createCart('customer-002');
  addItem(secondCart, 'bottle', 2);
  addItem(secondCart, 'mug');
  const secondOrder = checkout(secondCart);
  console.log(formatReceipt(secondOrder));

  console.log('Orders:', summarizeOrders([firstOrder, secondOrder]));
  console.log('Remaining inventory:', catalogSummary());
}

runDemo();
