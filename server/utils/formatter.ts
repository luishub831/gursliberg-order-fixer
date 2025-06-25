function pad(value: any, length: number, alignRight: boolean = false): string {
  const str = String(value ?? '');
  if (str.length >= length) return str.slice(0, length);
  return alignRight ? str.padStart(length) : str.padEnd(length);
}

export function formatOrder(order: any): string {
  const FN1 = [
    pad(`FN1`, 3),
    pad(`${order.order_number}`, 20),
    pad(order.customer.id, 20),
    pad(order.customer?.first_name + ' ' + order.customer?.last_name, 50),
    pad(order.shipping_address?.address1, 50),
    pad(order.shipping_address?.address2 || '', 50),
    pad(order.shipping_address?.zip, 10),
    pad(order.shipping_address?.city, 50),
    pad(order.shipping_address?.country_code, 2),
    pad(order.shipping_address?.country, 25),
    pad('', 50),
    pad(order.email, 100),
    pad(order.phone || '', 12),
    pad(order.total_weight, 12),
    pad('8999869', 20),
    pad('', 12),
    pad('', 48),
    pad('NGBF', 10),
    pad('0', 1),
    pad('0', 1),
  ];

  const FN2 = order.line_items.map((item, index) => [
    'FN2',
    pad(order.order_number, 20),
    pad('', 8),
    pad(item.sku || '', 21),
    pad(item.title || '', 80),
    pad(item.quantity, 9),
    pad(index + 1, 3),
    pad('1', 1),
    pad('93311', 6),
    pad('', 1),
  ].join('')).join('\n');

  return `${FN1.join('')}
${FN2}`;
};
