const express = require('express');
const { readJSON, writeJSON } = require('../utils/jsonStore');
const { recalcFromOrders } = require('./stats');

const router = express.Router();
const FILE = 'orders.json';

// GET /api/orders — список всех заказов (можно фильтровать ?status=new)
router.get('/', async (req, res) => {
  const orders = await readJSON(FILE, []);
  const { status } = req.query;

  if (status) {
    return res.json(orders.filter((o) => o.status === status));
  }
  res.json(orders);
});

// GET /api/orders/active — активные заказы (new/processing/shipped)
router.get('/active', async (req, res) => {
  const orders = await readJSON(FILE, []);
  const activeStatuses = ['new', 'processing', 'shipped'];
  res.json(orders.filter((o) => activeStatuses.includes(o.status)));
});

// GET /api/orders/mine — заказы текущего гостя (по cookie mw_guest_id)
router.get('/mine', async (req, res) => {
  const orders = await readJSON(FILE, []);
  res.json(orders.filter((o) => o.guestId === req.guestId));
});

// GET /api/orders/:id — один заказ
router.get('/:id', async (req, res) => {
  const orders = await readJSON(FILE, []);
  const order = orders.find((o) => String(o.id) === String(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }
  res.json(order);
});

// POST /api/orders — создать новый заказ
router.post('/', async (req, res) => {
  const orderData = req.body;

  if (!orderData || !orderData.items) {
    return res.status(400).json({ error: 'Поле "items" обязательно' });
  }

  const orders = await readJSON(FILE, []);

  const maxId = orders.reduce((max, o) => {
    const numId = parseInt(o.id, 10);
    return Number.isFinite(numId) && numId > max ? numId : max;
  }, 1000);

  const newOrder = {
    ...orderData,
    id: String(maxId + 1),
    date: new Date().toLocaleDateString('ru-RU'),
    status: orderData.status || 'new',
    guestId: req.guestId,
  };

  const updated = [newOrder, ...orders];
  await writeJSON(FILE, updated);

  // пересчитываем статистику (кол-во заказов по статусам, выручка)
  await recalcFromOrders();

  res.status(201).json(newOrder);
});

// PUT /api/orders/:id — обновить заказ целиком (или частично)
router.put('/:id', async (req, res) => {
  const orders = await readJSON(FILE, []);
  const exists = orders.some((o) => String(o.id) === String(req.params.id));

  if (!exists) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  const updated = orders.map((o) =>
    String(o.id) === String(req.params.id) ? { ...o, ...req.body, id: o.id } : o
  );

  await writeJSON(FILE, updated);
  await recalcFromOrders();
  res.json(updated.find((o) => String(o.id) === String(req.params.id)));
});

// PATCH /api/orders/:id/status — обновить только статус заказа
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Поле "status" обязательно' });
  }

  const orders = await readJSON(FILE, []);
  const exists = orders.some((o) => String(o.id) === String(req.params.id));

  if (!exists) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  const updated = orders.map((o) =>
    String(o.id) === String(req.params.id) ? { ...o, status } : o
  );

  await writeJSON(FILE, updated);
  await recalcFromOrders();
  res.json(updated.find((o) => String(o.id) === String(req.params.id)));
});

// DELETE /api/orders/:id — удалить заказ
router.delete('/:id', async (req, res) => {
  const orders = await readJSON(FILE, []);
  const updated = orders.filter((o) => String(o.id) !== String(req.params.id));

  if (updated.length === orders.length) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  await writeJSON(FILE, updated);
  await recalcFromOrders();
  res.json({ success: true, orders: updated });
});

module.exports = router;
