import React from 'react';
import styles from './CartComp.module.css';
import { useShop } from '../../contexts/ProductsContext';
import { useNavigate } from 'react-router-dom';

export default function CartComp() {
  const { 
    cart, 
    deleteFromCart, 
    clearCart,
    totalPrice,
    updateQuantity 
  } = useShop();

  if (cart.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <header className={styles.header}>
          <div className={styles.brandLogo}>MIRARWEAR</div>
          <h1 className={styles.pageTitle}>КОРЗИНА</h1>
        </header>
        <div className={styles.emptyCart}>
          <p>Ваша корзина пуста</p>
        </div>
      </div>
    );
  }
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/catalog/continue`);
   
  }
 const handleNavigateToStore = () => {
    navigate(`/catalog`);
   
  }
  return (
    <div className={styles.cartContainer}>
      <header className={styles.header}>
        <div onClick={()=>{handleNavigateToStore()}} className={styles.brandLogo}>MIRARWEAR</div>
        <h1 className={styles.pageTitle}>КОРЗИНА</h1>
      </header>

      <div className={styles.cartItemsList}>
        {cart.map(item => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.imageWrapper}>
              <img 
                src={item.photo}  
                alt={item.name}  
                className={styles.productImage} 
              />
            </div>

            <div className={styles.productInfo}>
              <span className={styles.productName}>
                {item.name}  
              </span>
            </div>

            <div className={styles.quantitySection}>
              <span className={styles.quantityLabel}>Количество</span>
              <div className={styles.selectWrapper}>
                <select 
                  className={styles.quantitySelect}
                  value={item.quantity || 1}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span className={styles.selectArrow}>▼</span>
              </div>
            </div>

            <div className={styles.productPrice}>
              {(item.price * (item.quantity || 1)).toLocaleString('ru-RU')} руб.
            </div>

            <button 
              onClick={() => deleteFromCart(item.id)} 
              className={styles.removeButton}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.totalSection}>
        Итого: {totalPrice.toLocaleString('ru-RU')} руб.
      </div>

      <footer className={styles.cartFooter}>
        <button onClick={clearCart} className={styles.clearCartBtn}>
          Очистить корзину
        </button>
        
        <div className={styles.checkoutGroup}>
          <button onClick={()=>{handleNavigate()}} className={styles.checkoutBtn}>
            Оформить заказ
          </button>
        </div>
      </footer>
    </div>
  );
}