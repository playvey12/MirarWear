const express = require('express');
const { readJSON, writeJSON } = require('../utils/jsonStore');

const router = express.Router();
const FILE = 'products.json';

// GET /api/products — список всех товаров (можно фильтровать ?category=hoodies)
router.get('/', async (req, res) => {
  const products = await readJSON(FILE, []);
  const { category } = req.query;

  if (category) {
    const filtered = products.filter(
      (p) => (p.category || '').toLowerCase() === category.toLowerCase()
    );
    return res.json(filtered);
  }

  res.json(products);
});

// GET /api/products/:id — один товар
router.get('/:id', async (req, res) => {
  const products = await readJSON(FILE, []);
  const product = products.find((p) => String(p.id) === String(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  res.json(product);
});

// POST /api/products — добавить новый товар
router.post('/', async (req, res) => {
  const newProduct = req.body;

  if (!newProduct || !newProduct.name) {
    return res.status(400).json({ error: 'Поле "name" обязательно' });
  }

  const products = await readJSON(FILE, []);

  const maxId = products.reduce((max, p) => {
    const numId = Number(p.id);
    return Number.isFinite(numId) && numId > max ? numId : max;
  }, 0);

  const productToSave = {
    id: newProduct.id ?? maxId + 1,
    ...newProduct,
  };

  const updated = [...products, productToSave];
  await writeJSON(FILE, updated);

  res.status(201).json(productToSave);
});

// PUT /api/products/:id — обновить товар
router.put('/:id', async (req, res) => {
  const products = await readJSON(FILE, []);
  const exists = products.some((p) => String(p.id) === String(req.params.id));

  if (!exists) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  const updated = products.map((p) =>
    String(p.id) === String(req.params.id) ? { ...p, ...req.body, id: p.id } : p
  );

  await writeJSON(FILE, updated);
  res.json(updated.find((p) => String(p.id) === String(req.params.id)));
});

// DELETE /api/products/:id — удалить товар
router.delete('/:id', async (req, res) => {
  const products = await readJSON(FILE, []);
  const updated = products.filter((p) => String(p.id) !== String(req.params.id));

  if (updated.length === products.length) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  await writeJSON(FILE, updated);
  res.json({ success: true, products: updated });
});

module.exports = router;
