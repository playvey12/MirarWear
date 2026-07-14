const API_URL = '/api/cart';

// credentials: 'include' обязателен — иначе браузер не будет
// отправлять/принимать cookie mw_guest_id при запросах к API
const withCreds = (options = {}) => ({ ...options, credentials: 'include' });

// Получить корзину текущего гостя
export const getCart = async () => {
  try {
    const response = await fetch(API_URL, withCreds());
    if (!response.ok) throw new Error('Failed to fetch cart');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

// Добавить товар (или увеличить количество, если уже есть в корзине)
export const addItemToCart = async (item) => {
  try {
    const response = await fetch(`${API_URL}/items`, withCreds({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }));
    if (!response.ok) throw new Error('Failed to add item to cart');
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Задать конкретное количество товара
export const setItemQuantity = async (itemId, quantity) => {
  try {
    const response = await fetch(`${API_URL}/items/${itemId}`, withCreds({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    }));
    if (!response.ok) throw new Error('Failed to update quantity');
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw error;
  }
};

// Удалить товар из корзины
export const removeItemFromCart = async (itemId) => {
  try {
    const response = await fetch(`${API_URL}/items/${itemId}`, withCreds({
      method: 'DELETE',
    }));
    if (!response.ok) throw new Error('Failed to remove item from cart');
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Полностью очистить корзину (например, после оформления заказа)
export const clearServerCart = async () => {
  try {
    const response = await fetch(API_URL, withCreds({ method: 'DELETE' }));
    if (!response.ok) throw new Error('Failed to clear cart');
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Полностью заменить корзину — используется один раз при первом запуске,
// чтобы перенести то, что уже лежало в localStorage у старых пользователей
export const replaceCart = async (items) => {
  try {
    const response = await fetch(API_URL, withCreds({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    }));
    if (!response.ok) throw new Error('Failed to sync cart');
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error syncing cart:', error);
    throw error;
  }
};
