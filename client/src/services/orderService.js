const API_URL = '/api/orders';

// credentials: 'include' — чтобы гостевой cookie уходил вместе с запросом
const withCreds = (options = {}) => ({ ...options, credentials: 'include' });

// Получить все заказы с сервера (можно передать status для фильтрации)
export const getOrders = async (status) => {
  try {
    const url = status ? `${API_URL}?status=${encodeURIComponent(status)}` : API_URL;
    const response = await fetch(url, withCreds());
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

// Получить только заказы текущего гостя (для страницы "Мои заказы")
export const getMyOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/mine`, withCreds());
    if (!response.ok) {
      throw new Error('Failed to fetch my orders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading my orders:', error);
    return [];
  }
};

// Получить один заказ по id
export const getOrderById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, withCreds());
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

// Создать новый заказ — сервер сам присваивает id/дату/статус/guestId и сохраняет в orders.json
export const addOrder = async (orderData) => {
  try {
    const response = await fetch(API_URL, withCreds({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    }));
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    const newOrder = await response.json();
    console.log('Заказ сохранён на сервере:', newOrder);
    return newOrder;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

// Обновить статус заказа
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}/status`, withCreds({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }));
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Обновить заказ (произвольные поля)
export const updateOrder = async (orderId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`, withCreds({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    }));
    if (!response.ok) {
      throw new Error('Failed to update order');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Удалить заказ
export const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`, withCreds({ method: 'DELETE' }));
    if (!response.ok) {
      throw new Error('Failed to delete order');
    }
    const data = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Заказы по статусу
export const getOrdersByStatus = async (status) => {
  if (!status) return getOrders();
  return getOrders(status);
};

// Активные заказы (new/processing/shipped)
export const getActiveOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/active`, withCreds());
    if (!response.ok) {
      throw new Error('Failed to fetch active orders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading active orders:', error);
    return [];
  }
};
