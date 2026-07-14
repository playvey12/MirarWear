import React, { useState } from 'react';
import styles from './OrderPageComp.module.css';
import { useShop } from '../../contexts/ProductsContext';
import { useAdmin } from '../../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function OrderPageComp() {
  const { cartCount, totalPrice, cart, clearCart } = useShop();
  const { formData, setFormData, addOrder } = useAdmin(); 
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNavigate = () => {
    navigate(`/order/ordersubmit`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    if (isSubmitting) return;
    
  
    if (!formData.name || !formData.phoneNumber || !formData.address) {
      alert('Пожалуйста, заполните все обязательные поля (Имя, Телефон, Адрес)');
      return;
    }

    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }

    try {
      setIsSubmitting(true);

  
      const orderData = {
        customer: formData.name,
        phone: formData.phoneNumber,
        email: formData.email || '',
        address: formData.address,
        comment: formData.comment || '',
        items: cart.map(item => ({
          name: item.name,
          size: item.size || 'OS',
          quantity: item.quantity || 1,
          price: item.price
        })),
        total: totalPrice,
        delivery: formData.delivery,
        telegram: formData.telegram || '',
        status: 'new' 
      };

   
      const newOrder = await addOrder(orderData);
      console.log('Заказ успешно создан:', newOrder);

      setFormData({
        delivery: 'self',
        name: '',
        phoneNumber: '',
        telegram: '',
        email: '',
        address: '',
        comment: ''
      });
      
      clearCart();
      

      handleNavigate();
      
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        MIRARWEAR
        <span className={styles.subtitle}>
          ОФОРМЛЕНИЕ ЗАКАЗА {cartCount} ТОВАР НА СУММУ {totalPrice} РУБ.
        </span>
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Блок 1: Тип доставки */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Выберите тип доставки</h2>
          <div className={styles.deliveryOptions}>
            {[
              { id: 'self', label: 'Самовывоз в Минске' },
              { id: 'cdek', label: 'CDEK' },
              { id: 'euro', label: 'Европочта' },
              { id: 'international', label: 'Международная доставка' }
            ].map((option) => (
              <label key={option.id} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={formData.delivery === option.id}
                  onChange={handleChange}
                />
                <span className={styles.radioText}>{option.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Блок 2: Ввод данных */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Введите данные</h2>
          <div className={styles.formGroup}>
            <input 
              name="name" 
              type="text" 
              placeholder="Полное имя (Ф.И.О.) *" 
              value={formData.name} 
              onChange={handleChange} 
              className={styles.input} 
              required 
            />
            <input 
              name="phoneNumber" 
              type="tel" 
              placeholder="Телефон *" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              className={styles.input} 
              required 
            />
            <input 
              name="telegram" 
              type="text" 
              placeholder="Telegram (@username)" 
              value={formData.telegram} 
              onChange={handleChange} 
              className={styles.input} 
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className={styles.input} 
            />
            <input 
              name="address" 
              type="text" 
              placeholder="Адрес доставки *" 
              value={formData.address} 
              onChange={handleChange} 
              className={styles.input} 
              required 
            />
            <textarea 
              name="comment" 
              placeholder="О чем нам нужно знать (комментарий)" 
              value={formData.comment} 
              onChange={handleChange} 
              className={styles.textarea} 
              rows={3} 
            />
          </div>
        </section>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  );
}