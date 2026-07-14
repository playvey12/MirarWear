import React, { useState } from 'react';
import styles from './ProductsListComp.module.css';
import ModalWindowForAddItem from '../../ModalWindowForAddItem/ModalWindowForAddItem';
import { useAdmin } from '../../../contexts/AdminContext';

export default function ProductsListComp() {
  const { catalogItems, deleteProduct, addProduct } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const handleAddProduct = (newProduct) => {
    addProduct(newProduct);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(id);
    }
  };

  const handleEdit = (id) => {
    alert(`Редактирование товара #${id}`);
  };

  const getStatus = (item) => {
    return item.inStock ? 'В наличии' : 'Нет в наличии';
  };

  const getCategoryName = (categoryValue) => {
    const categories = {
      'hoodies': 'ХУДИ / ЗИП-ХУДИ',
      'tshirts': 'ФУТБОЛКИ / ЛОНГСЛИВЫ',
      'pants': 'ШТАНЫ',
      'shorts': 'ШОРТЫ',
      'bags': 'СУМКИ',
      'accessories': 'АКСЕССУАРЫ'
    };
    return categories[categoryValue] || categoryValue;
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Товары</h1>
          <p className={styles.pageSubtitle}>
            Управление товарами ({catalogItems.length})
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className={styles.addBtn}
        >
          + Добавить товар
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Фото</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Размеры</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {catalogItems.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#999999',
                  fontSize: '14px'
                }}>
                  Товаров пока нет. Нажмите "Добавить товар" чтобы создать первый.
                </td>
              </tr>
            ) : (
              catalogItems.map((product) => (
                <tr 
                  key={product.id}
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  <td>
                    <div className={styles.imageWrapper}>
                      <img 
                        src={hoveredProductId === product.id && product.hoverPhoto 
                          ? product.hoverPhoto 
                          : product.coverPhoto || product.photo || 'https://via.placeholder.com/48x48?text=No+Image'
                        } 
                        alt={product.name} 
                        className={styles.tableImage}
                      />
                      {product.hoverPhoto && (
                        <div className={styles.hoverIndicator}>
                          <span className={styles.hoverBadge}>Hover</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={styles.productName}>{product.name}</td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {product.categoryName || getCategoryName(product.category)}
                    </span>
                  </td>
                  <td className={styles.productPrice}>
                    {product.price.toLocaleString('ru-RU')} ₽
                    {product.oldPrice && (
                      <span className={styles.oldPrice}>
                        {product.oldPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.sizesList}>
                      {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.map((size) => (
                          <span key={size} className={styles.sizeTag}>
                            {size}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.statusContainer}>
                      <span className={`${styles.statusBadge} ${
                        product.inStock ? styles.statusInStock : styles.statusOutOfStock
                      }`}>
                        {getStatus(product)}
                      </span>
                      {product.isNew && (
                        <span className={`${styles.statusBadge} ${styles.statusNew}`}>
                          NEW
                        </span>
                      )}
                      {product.isSale && (
                        <span className={`${styles.statusBadge} ${styles.statusSale}`}>
                          SALE
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                        aria-label="Удалить"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ModalWindowForAddItem 
          onClose={() => setIsModalOpen(false)}
          onAddProduct={handleAddProduct}
        />
      )}
    </div>
  );
}