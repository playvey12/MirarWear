import React, { useState } from 'react';
import styles from './CatalogComp.module.css';
import { useShop } from '../../contexts/ProductsContext';
import { useAdmin } from '../../contexts/AdminContext';

export default function CatalogComp() {
  const [hoverItemId, setHoverItemId] = useState(null);
  const { 
    activeItemId, 
    setActiveItemId, 
    isActive, 
    setIsActive,
    addToCart 
  } = useShop();
  
  const { filteredItems } = useAdmin();

  function handleOpenItem(itemId) {
    setActiveItemId(itemId);
    setIsActive(true);
  }

  const handleAddToCart = (e, item) => {
    e.stopPropagation(); 
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      photo: item.coverPhoto || item.photo,
      quantity: 1
    });
  };

  return (
    <div className={styles.catalogContainer}>
      <div className={styles.itemsContainer}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Товары не найдены</p>
            <p>Попробуйте выбрать другую категорию</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isHovered = hoverItemId === item.id;
            
            return (
              <div 
                key={item.id} 
                className={styles.catalogItem}
                onMouseEnter={() => setHoverItemId(item.id)}
                onMouseLeave={() => setHoverItemId(null)}
                onClick={() => handleOpenItem(item.id)}
              >
                <div className={styles.imageWrapper}>
                  {/* Основное фото */}
                  <img 
                    src={item.coverPhoto || item.photo || 'https://via.placeholder.com/300x400?text=No+Image'} 
                    alt={item.name} 
                    className={`${styles.catalogItemPhoto} ${isHovered && item.hoverPhoto ? styles.hidden : ''}`}
                  />
                  
                  {/* Hover фото */}
                  {item.hoverPhoto && (
                    <img 
                      src={item.hoverPhoto} 
                      alt={item.name} 
                      className={`${styles.catalogItemPhoto} ${styles.hoverPhoto} ${isHovered ? styles.visible : ''}`}
                    />
                  )}
                  
                  {/* Бейджи */}
                  <div className={styles.badges}>
                    {item.isNew && (
                      <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>
                    )}
                    {item.isSale && (
                      <span className={`${styles.badge} ${styles.badgeSale}`}>SALE</span>
                    )}
                    {!item.inStock && (
                      <span className={`${styles.badge} ${styles.badgeOutOfStock}`}>OUT</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.catalogItemName}>{item.name}</div>
                
                <div className={styles.priceContainer}>
                  {item.oldPrice && (
                    <div className={styles.catalogItemOldPrice}>{item.oldPrice.toLocaleString('ru-RU')} ₽</div>
                  )}
                  <div className={styles.catalogItemNewPrice}>
                    {item.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}