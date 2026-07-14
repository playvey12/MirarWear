const express = require('express');
const { readJSON, writeJSON } = require('../utils/jsonStore');

const router = express.Router();
const FILE = 'cart.json';

// Файл хранит корзины ВСЕХ гостей одним объектом:
// { "<guestId>": { items: [...], updatedAt } }
async function getAllCarts() {
  return readJSON(FILE, {});
}

async function getCartForGuest(guestId) {
  const carts = await getAllCarts();
  return carts[guestId] || { items: [], updatedAt: null };
}

async function saveCartForGuest(guestId, cartData) {
  const carts = await getAllCarts();
  carts[guestId] = { ...cartData, updatedAt: new Date().toISOString() };
  await writeJSON(FILE, carts);
  return carts[guestId];
}

// GET /api/cart — корзина текущего гостя
router.get('/', async (req, res) => {
  const cart = await getCartForGuest(req.guestId);
  res.json(cart);
});

// PUT /api/cart — полностью заменить корзину (например, при синхронизации с фронта)
router.put('/', async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Поле "items" должно быть массивом' });
  }
  const updated = await saveCartForGuest(req.guestId, { items });
  res.json(updated);
});

// POST /api/cart/items — добавить товар (или увеличить количество, если уже есть)
router.post('/items', async (req, res) => {
  const newItem = req.body;
  if (!newItem || !newItem.id) {
    return res.status(400).json({ error: 'Поле "id" обязательно' });
  }

  const cart = await getCartForGuest(req.guestId);
  const existing = cart.items.find((i) => String(i.id) === String(newItem.id));

  let items;
  if (existing) {
    items = cart.items.map((i) =>
      String(i.id) === String(newItem.id)
        ? { ...i, quantity: (i.quantity || 1) + 1 }
        : i
    );
  } else {
    items = [...cart.items, { ...newItem, quantity: 1 }];
  }

  const updated = await saveCartForGuest(req.guestId, { items });
  res.json(updated);
});

// PATCH /api/cart/items/:id — задать конкретное количество товара
router.patch('/items/:id', async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Поле "quantity" должно быть больше 0' });
  }

  const cart = await getCartForGuest(req.guestId);
  const exists = cart.items.some((i) => String(i.id) === String(req.params.id));
  if (!exists) {
    return res.status(404).json({ error: 'Товар не найден в корзине' });
  }

  const items = cart.items.map((i) =>
    String(i.id) === String(req.params.id) ? { ...i, quantity } : i
  );

  const updated = await saveCartForGuest(req.guestId, { items });
  res.json(updated);
});

// DELETE /api/cart/items/:id — убрать товар из корзины
router.delete('/items/:id', async (req, res) => {
  const cart = await getCartForGuest(req.guestId);
  const items = cart.items.filter((i) => String(i.id) !== String(req.params.id));

  const updated = await saveCartForGuest(req.guestId, { items });
  res.json(updated);
});

// DELETE /api/cart — очистить корзину (например, после оформления заказа)
router.delete('/', async (req, res) => {
  const updated = await saveCartForGuest(req.guestId, { items: [] });
  res.json(updated);
});

module.exports = router;
