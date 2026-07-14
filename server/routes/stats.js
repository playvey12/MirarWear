const express = require('express');
const { readJSON, writeJSON } = require('../utils/jsonStore');

const router = express.Router();
const STATS_FILE = 'adminStats.json';
const ORDERS_FILE = 'orders.json';
const PRODUCTS_FILE = 'products.json';

const DEFAULT_STATS = {
  visits: 0,
  productViews: {}, // { productId: count }
  ordersByStatus: { new: 0, processing: 0, shipped: 0, completed: 0, cancelled: 0 },
  totalRevenue: 0,
  completedRevenue: 0,
  lastUpdated: null,
};

// Пересчитывает часть статистики, зависящую от заказов, с нуля —
// полезно, если заказы были отредактированы напрямую в orders.json
async function recalcFromOrders() {
  const orders = await readJSON(ORDERS_FILE, []);
  const stats = await readJSON(STATS_FILE, DEFAULT_STATS);

  const ordersByStatus = { new: 0, processing: 0, shipped: 0, completed: 0, cancelled: 0 };
  let totalRevenue = 0;
  let completedRevenue = 0;

  for (const order of orders) {
    if (ordersByStatus[order.status] !== undefined) {
      ordersByStatus[order.status] += 1;
    }
    totalRevenue += order.total || 0;
    if (order.status === 'completed') {
      completedRevenue += order.total || 0;
    }
  }

  const updated = {
    ...stats,
    ordersByStatus,
    totalRevenue,
    completedRevenue,
    lastUpdated: new Date().toISOString(),
  };

  await writeJSON(STATS_FILE, updated);
  return updated;
}

// GET /api/stats — сводная статистика: сохранённые счётчики + свежие данные
// по количеству товаров/заказов (читается из файлов каждый раз)
router.get('/', async (req, res) => {
  const [stats, products, orders] = await Promise.all([
    readJSON(STATS_FILE, DEFAULT_STATS),
    readJSON(PRODUCTS_FILE, []),
    readJSON(ORDERS_FILE, []),
  ]);

  const activeStatuses = ['new', 'processing', 'shipped'];

  res.json({
    ...stats,
    totalProducts: products.length,
    totalOrders: orders.length,
    activeOrders: orders.filter((o) => activeStatuses.includes(o.status)).length,
  });
});

// POST /api/stats/visit — зафиксировать посещение сайта
router.post('/visit', async (req, res) => {
  const stats = await readJSON(STATS_FILE, DEFAULT_STATS);
  const updated = {
    ...stats,
    visits: (stats.visits || 0) + 1,
    lastUpdated: new Date().toISOString(),
  };
  await writeJSON(STATS_FILE, updated);
  res.json(updated);
});

// POST /api/stats/product-view/:id — зафиксировать просмотр карточки товара
router.post('/product-view/:id', async (req, res) => {
  const stats = await readJSON(STATS_FILE, DEFAULT_STATS);
  const productViews = { ...(stats.productViews || {}) };
  productViews[req.params.id] = (productViews[req.params.id] || 0) + 1;

  const updated = { ...stats, productViews, lastUpdated: new Date().toISOString() };
  await writeJSON(STATS_FILE, updated);
  res.json(updated);
});

// POST /api/stats/recalculate — пересчитать статистику по заказам с нуля
router.post('/recalculate', async (req, res) => {
  const updated = await recalcFromOrders();
  res.json(updated);
});

module.exports = router;
module.exports.recalcFromOrders = recalcFromOrders;
