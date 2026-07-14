import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../services/productService';
import {
  getOrders,
  addOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByStatus,
} from '../services/orderService';
import { useShop } from './ProductsContext';

const AdminContext = createContext();

export default function AdminProvider({ children }) {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [catalogItems, setCatalogItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart } = useShop();

  const [formData, setFormData] = useState({
    delivery: 'self',
    name: '',
    phoneNumber: '',
    telegram: '',
    email: '',
    address: '',
    comment: '',
    items: cart
  });


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [products, loadedOrders] = await Promise.all([
          getProducts(),
          getOrders(),
        ]);
        setCatalogItems(products);
        setOrders(loadedOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const filteredItems = useMemo(() => {
    if (!catalogItems || !Array.isArray(catalogItems)) return [];
    if (!category) return catalogItems;
    return catalogItems.filter(item =>
      item.category?.toLowerCase() === category.toLowerCase()
    );
  }, [catalogItems, category]);

  const activeOrders = useMemo(() => {
    const activeStatuses = ['new', 'processing', 'shipped'];
    return orders.filter(order => activeStatuses.includes(order.status));
  }, [orders]);

  const handleAddProduct = async (newItem) => {
    try {
      setLoading(true);
      const added = await addProduct(newItem);
      setCatalogItems(prev => [...prev, added]);
      setLoading(false);
      return added;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      setCatalogItems(prev => prev.filter(item => item.id !== productId));
      setLoading(false);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      setLoading(true);

      const updatedList = await updateProduct(productId, updatedData);
      setCatalogItems(updatedList);
      setLoading(false);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const handleAddOrder = async (orderData) => {
    try {
      setLoading(true);
      const newOrder = await addOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      setLoading(false);
      return newOrder;
    } catch (err) {
      console.error('Error adding order:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(order => order.id === orderId ? updatedOrder : order)
      );
      setLoading(false);
      return updatedOrder;
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const handleUpdateOrder = async (orderId, updatedData) => {
    try {
      setLoading(true);
      const updatedOrder = await updateOrder(orderId, updatedData);
      setOrders(prev =>
        prev.map(order => order.id === orderId ? updatedOrder : order)
      );
      setLoading(false);
      return updatedOrder;
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      setLoading(true);
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
      setLoading(false);
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <AdminContext.Provider value={{
      catalogItems,
      setCatalogItems,
      filteredItems,
      category,
      searchParams,
      orders,
      setOrders,
      activeOrders,
      getOrdersByStatus,
      loading,
      error,
      addProduct: handleAddProduct,
      deleteProduct: handleDeleteProduct,
      updateProduct: handleUpdateProduct,
      addOrder: handleAddOrder,
      updateOrderStatus: handleUpdateOrderStatus,
      updateOrder: handleUpdateOrder,
      deleteOrder: handleDeleteOrder,
      formData,
      setFormData
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
