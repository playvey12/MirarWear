import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCart,
  addItemToCart,
  setItemQuantity,
  removeItemFromCart,
  clearServerCart,
  replaceCart,
} from '../services/cartService';

const ProductsContext = createContext();

export default function ProductsProvider({ children }) {
  const [activeItemId, setActiveItemId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [order, setOrder] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const initCart = async () => {
      try {
     
        const legacyCartRaw = localStorage.getItem('cart');
        if (legacyCartRaw) {
          const legacyCart = JSON.parse(legacyCartRaw);
          const serverCart = await getCart();
          if (Array.isArray(legacyCart) && legacyCart.length > 0 && serverCart.length === 0) {
            const merged = await replaceCart(legacyCart);
            setCart(merged);
          } else {
            setCart(serverCart);
          }
          localStorage.removeItem('cart');
        } else {
          const serverCart = await getCart();
          setCart(serverCart);
        }
      } catch (err) {
        console.error('Ошибка загрузки корзины:', err);
      } finally {
        setCartLoading(false);
      }
    };

    initCart();
  }, []);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);
  }, [cart]);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(total);
  }, [cart]);

 
  async function addToCart(newItem) {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...newItem, quantity: 1 }];
    });

    try {
      const serverItems = await addItemToCart(newItem);
      setCart(serverItems);
    } catch (err) {
      console.error('Не удалось сохранить корзину на сервере:', err);
    }
  }

  async function deleteFromCart(itemId) {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    try {
      const serverItems = await removeItemFromCart(itemId);
      setCart(serverItems);
    } catch (err) {
      console.error('Не удалось удалить товар из корзины на сервере:', err);
    }
  }

  async function clearCart() {
    setCart([]);
    try {
      await clearServerCart();
    } catch (err) {
      console.error('Не удалось очистить корзину на сервере:', err);
    }
  }

  async function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      deleteFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    try {
      const serverItems = await setItemQuantity(itemId, newQuantity);
      setCart(serverItems);
    } catch (err) {
      console.error('Не удалось обновить количество на сервере:', err);
    }
  }

  useEffect(() => {
    if (isActive && activeItemId !== null) {
      navigate(`/product/${activeItemId}`);
      setIsActive(false);
    }
  }, [isActive, activeItemId, navigate]);

  return (
    <ProductsContext.Provider value={{
      activeItemId, setActiveItemId, isActive, setIsActive,
      cartCount, cart, setCart, addToCart, deleteFromCart,
      clearCart, updateQuantity, selectedCategory, setSelectedCategory,
      totalPrice, order, setOrder, cartLoading
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useShop = () => useContext(ProductsContext);
