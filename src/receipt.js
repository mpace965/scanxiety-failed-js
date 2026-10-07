export function formatMoney(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export function formatReceipt(order) {
  const lines = [`Order for ${order.customerId}`, `Status: ${order.status}`, ''];
  for (const item of order.items) {
    lines.push(`${item.quantity} x ${item.name}: ${formatMoney(item.unitPrice * item.quantity)}`);
  }
  lines.push('');
  lines.push(`Subtotal: ${formatMoney(order.totals.subtotal)}`);
  lines.push(`Discount: ${formatMoney(order.totals.discount)}`);
  lines.push(`Tax: ${formatMoney(order.totals.tax)}`);
  lines.push(`Shipping: ${formatMoney(order.totals.shipping)}`);
  lines.push(`Total: ${formatMoney(order.totals.total)}`);
  return lines.join('\n');
}

export function summarizeOrders(orders) {
  const summary = { orders: orders.length, units: 0, revenue: 0, customers: 0 };
  const customers = new Set();
  for (const order of orders) {
    customers.add(order.customerId);
    summary.units += order.items.reduce((sum, item) => sum + item.quantity, 0);
    summary.revenue += order.totals.total;
  }
  summary.customers = customers.size;
  return summary;
}
