// Replace these sample details with the real owner contact information before publishing.
const OWNER = {
  lineId: 'YOUR_LINE_ID',
  phone: '+66 XX XXX XXXX',
  email: 'hello@example.com',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  lineUrl: 'https://line.me/'
};
const ARTIST_BIO = 'The artist behind Knuckles works at the intersection of bold form, everyday function, and personal expression. Each design begins with a simple question: can an ordinary object make someone feel something?';
const PRODUCTS = [
  { id: 'kn-001', name: 'Knuckles Form 01', price: 89, weight: '420 g', tag: 'FIRST EDITION', art: 'art-sculpture', description: 'A sculptural statement piece with a tactile finish and a confident, balanced silhouette.', artist: 'Designed by the Knuckles studio to explore the tension between soft organic shapes and industrial materials.' },
  { id: 'kn-002', name: 'Knuckles Stone 02', price: 65, weight: '310 g', tag: 'STUDIO PICK', art: 'art-stone', description: 'A quiet, stone-inspired object with a natural profile and considered proportions.', artist: 'Designed as a study in natural forms, surface texture, and the beauty of small imperfections.' },
  { id: 'kn-003', name: 'Knuckles Loop 03', price: 110, weight: '560 g', tag: 'LIMITED RUN', art: 'art-loop', description: 'A bold looped form made to stand out on a shelf, desk, or carefully styled space.', artist: 'Designed around a single continuous gesture, turning a familiar shape into a distinctive object.' }
];
let cart = JSON.parse(sessionStorage.getItem('knucklesCart') || '[]');
const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderProducts() {
  document.getElementById('product-grid').innerHTML = PRODUCTS.map((p, i) => `<article class="product-card"><div class="product-image"><span class="product-index">N° 0${i + 1}</span><span class="product-tag">${esc(p.tag)}</span><div class="product-art ${p.art}" aria-hidden="true"></div></div><div class="product-info"><div class="product-title-row"><div><h3>${esc(p.name)}</h3><span class="weight">WEIGHT / ${esc(p.weight)}</span></div><span class="price">${money(p.price)}</span></div><p class="product-desc">${esc(p.description)}</p><div class="product-bottom"><span class="weight">DESIGN / KNUCKLES STUDIO</span><button type="button" data-add="${p.id}">Add to cart +</button></div></div></article>`).join('');
}
function saveCart() { sessionStorage.setItem('knucklesCart', JSON.stringify(cart)); renderCart(); }
function addToCart(id) { const p = PRODUCTS.find(x => x.id === id); if (!p) return; const found = cart.find(x => x.id === id); if (found) found.quantity = Math.min(99, found.quantity + 1); else cart.push({ id, quantity: 1 }); saveCart(); showToast(`${p.name} added to cart`); }
function renderCart() {
  const count = cart.reduce((s, i) => s + i.quantity, 0); document.getElementById('cart-count').textContent = count;
  const items = cart.map(i => { const p = PRODUCTS.find(x => x.id === i.id); return p ? { ...p, quantity: i.quantity } : null; }).filter(Boolean);
  const host = document.getElementById('checkout-items');
  host.innerHTML = items.length ? items.map(p => `<div class="checkout-item"><div><strong>${esc(p.name)}</strong><small>${money(p.price)} · ${esc(p.weight)}</small><div class="qty-controls"><button type="button" data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${p.quantity}</span><button type="button" data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button><button type="button" class="remove-item" data-remove="${p.id}">Remove</button></div></div><strong>${money(p.price * p.quantity)}</strong></div>`).join('') : '<p class="empty-cart">Your cart is empty. Add a piece from the collection to get started.</p>';
  document.getElementById('cart-total').textContent = money(items.reduce((s, p) => s + p.price * p.quantity, 0));
}
function showToast(message) { const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => el.classList.remove('show'), 2300); }
document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]'); if (add) addToCart(add.dataset.add);
  const qty = e.target.closest('[data-qty]'); if (qty) { const item = cart.find(i => i.id === qty.dataset.qty); if (item) { item.quantity += Number(qty.dataset.delta); if (item.quantity <= 0) cart = cart.filter(i => i.id !== item.id); saveCart(); } }
  const remove = e.target.closest('[data-remove]'); if (remove) { cart = cart.filter(i => i.id !== remove.dataset.remove); saveCart(); }
});
document.getElementById('open-cart').addEventListener('click', () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }));
document.getElementById('social-links').innerHTML = `<a href="${esc(OWNER.lineUrl)}" target="_blank" rel="noopener">LINE · ${esc(OWNER.lineId)}</a><a href="${esc(OWNER.instagram)}" target="_blank" rel="noopener">Instagram ↗</a><a href="${esc(OWNER.facebook)}" target="_blank" rel="noopener">Facebook ↗</a><a href="mailto:${esc(OWNER.email)}">Email ↗</a><a href="tel:${esc(OWNER.phone.replace(/[^+\d]/g,''))}">Call owner ↗</a>`;
document.getElementById('artist-bio').textContent = ARTIST_BIO;
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('order-form').addEventListener('submit', async e => {
  e.preventDefault(); const status = document.getElementById('form-status');
  const items = cart.map(i => { const p = PRODUCTS.find(x => x.id === i.id); return p ? { id: p.id, name: p.name, price: p.price, quantity: i.quantity } : null; }).filter(Boolean);
  if (!items.length) { status.textContent = 'Please add at least one item to your cart first.'; return; }
  const data = Object.fromEntries(new FormData(e.currentTarget).entries()); data.items = items;
  const button = e.currentTarget.querySelector('button[type="submit"]'); button.disabled = true; button.textContent = 'Sending enquiry…'; status.textContent = '';
  try { const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Could not send enquiry.'); status.textContent = `${result.message} Reference: ${result.orderId}. Estimated subtotal: ${money(result.total)}.`; cart = []; saveCart(); e.currentTarget.reset(); }
  catch (err) { status.textContent = `Could not save the order online: ${err.message}. Please contact the owner directly using the links below.`; }
  finally { button.disabled = false; button.innerHTML = 'Send order enquiry <span>↗</span>'; }
});
renderProducts(); renderCart();
