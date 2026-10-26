const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const ordersFile = path.join(__dirname, 'orders.json');
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'Knuckles Showcase Shop' }));
app.post('/api/orders', (req, res) => {
  const { name, phone, email, address, items, paymentMethod, note } = req.body || {};
  if (!name || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Please provide your name, phone, address, and at least one item.' });
  }
  const order = {
    id: `KN-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    name: String(name).slice(0, 120), phone: String(phone).slice(0, 60),
    email: String(email || '').slice(0, 160), address: String(address).slice(0, 1000),
    items: items.slice(0, 30).map(i => ({ id: String(i.id || '').slice(0, 80), name: String(i.name || '').slice(0, 120), quantity: Math.max(1, Math.min(99, Number(i.quantity) || 1)), price: Math.max(0, Number(i.price) || 0) })),
    paymentMethod: String(paymentMethod || 'Contact owner').slice(0, 100), note: String(note || '').slice(0, 1000)
  };
  order.total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let orders = [];
  try { orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8')); } catch (_) {}
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  res.status(201).json({ ok: true, orderId: order.id, total: order.total, message: 'Order enquiry saved. Please contact the owner to confirm stock, delivery, and payment.' });
});
app.listen(PORT, () => console.log(`Knuckles Showcase Shop running at http://localhost:${PORT}`));
