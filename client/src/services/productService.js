const API_URL = '/api/products';

// Получить все товары (можно передать category для фильтрации на сервере)
export const getProducts = async (category) => {
  try {
    const url = category ? `${API_URL}?category=${encodeURIComponent(category)}` : API_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// Добавить новый товар — сохраняется на сервере в products.json
export const addProduct = async (newProduct) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) {
      throw new Error('Failed to add product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Удалить товар
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/${productId}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Обновить товар
export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    // сервер отдаёт только обновлённый товар — подтягиваем актуальный полный список
    return await getProducts();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Получить товар по id
export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/${productId}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

export default {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
};
