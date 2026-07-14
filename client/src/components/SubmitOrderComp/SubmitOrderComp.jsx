import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SubmitOrderComp.module.css';
export default function SubmitOrderComp() {
  return (
   <div className={styles.successContainer}>
      <h1 className={styles.successTitle}>Спасибо за заказ</h1>
      <p className={styles.successMessage}>
        Ваш заказ принят. Мы свяжемся с вами для подтверждения доставки в Telegram в течение нескольких дней.
      </p>
      <Link to="/" className={styles.homeButton}>
        Вернуться в каталог
      </Link>
    </div>
  )
}
