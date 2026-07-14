import React from 'react';

import { Link } from 'react-router-dom'; 
import styles from './ErorPageComp.module.css';

export default function ErorPageComp() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>ТОВАР НЕ НАЙДЕН</h2>
        <p className={styles.errorDescription}>
          ВОЗМОЖНО, ДАННАЯ ПОЗИЦИЯ ПОЛНОСТЬЮ РАСПРОДАНА <br />
          ИЛИ ССЫЛКА НА НЕЕ БОЛЬШЕ НЕ ДЕЙСТВИТЕЛЬНА.
        </p>
       
        <Link to="/" className={styles.backButton}>
          В КАТАЛОГ
        </Link>
      </div>
    </div>
  );
}