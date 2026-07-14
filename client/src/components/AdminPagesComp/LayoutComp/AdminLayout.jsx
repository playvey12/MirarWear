import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }) {  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  return (
    <div className={styles.layout}>
   
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>MIRARWEAR</span>
          <small>Админ-панель</small>
        </div>

        <nav className={styles.nav}>
          <NavLink 
            to="/tihonloh/admin/dashboard" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            end
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
            </svg>
            <span>Обзор</span>
          </NavLink>

          <NavLink 
            to="/tihonloh/admin/products" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
            <span>Товары</span>
          </NavLink>


          <NavLink 
            to="/tihonloh/admin/orders" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
              <line x1="8" y1="9" x2="16" y2="9" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="12" y2="17" />
            </svg>
            <span>Заказы</span>
          </NavLink>
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Выйти</span>
        </button>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}