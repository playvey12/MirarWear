import React, { useState, useEffect } from 'react'

import { useShop } from '../../contexts/ProductsContext';
import styles from './RandomClothesComp.module.css';
import { useAdmin } from '../../contexts/AdminContext';

export default function RandomClothesComp() {
  const [hoverItemId, setHoverItemId] = useState(null);
  const [randomClothes, setRandomClothes] = useState([]); 
  const { activeItemId, setActiveItemId, isActive, setIsActive } = useShop();
const {catalogItems}=useAdmin()
  useEffect(() => {
    if (catalogItems && catalogItems.length > 0) {
      const shuffled = [...catalogItems].sort(() => 0.5 - Math.random());
      setRandomClothes(shuffled.slice(0, 3)); 
    }
  }, []);

  function handleOpenItem(itemId) {
    setActiveItemId(itemId);
    setIsActive(true);
  }

  return (
    <>
      <div className={styles.catalogContainer}>
        <div className={styles.itemsContainer}>
          {randomClothes.map((item, idx) => {
            const isHovered = hoverItemId === item.id;
            
            return (
              <div 
             
                key={`random-item-${item.id}-${idx}`} 
                className={styles.catalogItem}
                onMouseEnter={() => setHoverItemId(item.id)}
                onMouseLeave={() => setHoverItemId(null)}
                onClick={() => handleOpenItem(item.id)}
              >
                <div className={styles.imageWrapper}>
                  
                  {item.coverPhoto && item.coverPhoto.trim() !== "" && (
                    <img 
                      src={item.coverPhoto} 
                      alt={item.name} 
                      className={`${styles.catalogItemPhoto} ${isHovered ? styles.hidden : ''}`}
                    />
                  )}
                  
                  {item.hoverPhoto && item.hoverPhoto.trim() !== "" && (
                    <img 
                      src={item.hoverPhoto} 
                      alt={item.name} 
                      className={`${styles.catalogItemPhoto} ${styles.hoverPhoto} ${isHovered ? styles.visible : ''}`}
                    />
                  )}
                </div>
                <div className={styles.catalogItemName}>{item.name}</div>
                <div className={styles.priceRow}>
                  {item.oldPrice && (
                    <div className={styles.catalogItemOldPrice}>{item.oldPrice} ₽</div>
                  )}
                  <div className={styles.catalogItemNewPrice}>{item.price} ₽</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}