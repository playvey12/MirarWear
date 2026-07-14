import React, { useState, useEffect } from 'react';
import styles from './ProductComp.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../contexts/ProductsContext';
import { useAdmin } from '../../contexts/AdminContext';
import ErorPageComp from '../../pages/ErorPage/ErorPageComp';

export default function ProductComp() {
  const { addToCart, cartCount } = useShop();
  const { catalogItems } = useAdmin(); // Получаем товары из админки
  const { id } = useParams();
  const navigate = useNavigate();

  // Находим товар по ID
  const product = catalogItems.find(item => item.id === Number(id));

  const [selectedSize, setSelectedSize] = useState('');
  const [activePhoto, setActivePhoto] = useState('');
  const [activeSizeGrid, setActiveSizeGrid] = useState(false);

  useEffect(() => {
    if (product) {
      // Устанавливаем первый размер по умолчанию
      if (product.sizes?.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      // Устанавливаем первое фото из галереи или обложку
      if (product.galleryPhotos?.length > 0) {
        setActivePhoto(product.galleryPhotos[0]);
      } else if (product.coverPhoto) {
        setActivePhoto(product.coverPhoto);
      } else if (product.photo) {
        setActivePhoto(product.photo);
      }
    }
  }, [product]);

  // Если товар не найден
  if (!product) {
    return <ErorPageComp />;
  }

  // Массив фото для отображения
  const productImages = product.galleryPhotos?.length > 0 
    ? product.galleryPhotos 
    : [product.coverPhoto || product.photo || 'https://via.placeholder.com/600x800?text=No+Image'];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.coverPhoto || product.photo,
      size: selectedSize,
      quantity: 1
    });
  };

  const handleClearCategoryClick = () => {
    navigate('/catalog');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 onClick={handleClearCategoryClick} className={styles.brandLogo}>
          MIRARWEAR
        </h1>
        <div className={styles.cartLink}>
          КОРЗИНА <span>{cartCount}</span>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.imageSection}>
          <img 
            src={activePhoto || product.coverPhoto || product.photo || 'https://via.placeholder.com/600x800?text=No+Image'} 
            alt={product.name} 
            className={styles.productImage}
          />
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.productTitle}>{product.name}</h2>
          
          {/* Миниатюры */}
          <div className={styles.thumbsGrid}>
            {productImages.slice(0, 4).map((imgSrc, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.thumbButton} ${activePhoto === imgSrc ? styles.activeThumb : ''}`}
                onClick={() => setActivePhoto(imgSrc)}
              >
                <img src={imgSrc} alt={`Просмотр ${idx + 1}`} className={styles.thumbImage} />
              </button>
            ))}
            {productImages.length > 4 && (
              <span className={styles.morePhotos}>+{productImages.length - 4}</span>
            )}
          </div>

          {/* Характеристики */}
          <div className={styles.productDescription}>
            {product.description && (
              <p className={styles.descriptionText}>{product.description}</p>
            )}
            {product.features?.map((item, index) => (
              <p key={index}>— {item}</p>
            ))}
            {product.material && (
              <p>Материал: {product.material}</p>
            )}
            {product.fit && (
              <p>Посадка: {product.fit}</p>
            )}
          </div>

          {/* Размерная сетка */}
          {product.sizeChart && (
            <a 
              href="#size-chart" 
              onClick={(e) => { 
                e.preventDefault(); 
                setActiveSizeGrid(true); 
              }} 
              className={styles.sizeChartLink}
            >
              РАЗМЕРНАЯ СЕТКА
            </a>
          )}

          {/* Цена */}
          <div className={styles.priceContainer}>
            {product.oldPrice && (
              <span className={styles.oldPrice}>
                {product.oldPrice.toLocaleString('ru-RU')} ₽
              </span>
            )}
            <div className={styles.productPrice}>
              {product.price?.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          {/* Статусы */}
          <div className={styles.statusContainer}>
            {!product.inStock && (
              <span className={styles.outOfStock}>Нет в наличии</span>
            )}
            {product.isNew && (
              <span className={styles.newBadge}>NEW</span>
            )}
            {product.isSale && (
              <span className={styles.saleBadge}>SALE</span>
            )}
          </div>

          {/* Выбор размера и кнопка */}
          <div className={styles.actionRow}>
            <div className={styles.selectWrapper}>
              <select 
                className={styles.sizeSelect} 
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                disabled={!product.inStock}
              >
                {product.sizes?.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>

            <button 
              type="button" 
              className={styles.addToCartBtn} 
              onClick={handleAddToCart}
              disabled={!product.inStock || !selectedSize}
            >
              {product.inStock ? 'В КОРЗИНУ' : 'НЕТ В НАЛИЧИИ'}
            </button>
          </div>
        </div>
      </main>

      {/* Модалка с размерной сеткой */}
      {activeSizeGrid && (
        <div className={styles.modalOverlay} onClick={() => setActiveSizeGrid(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setActiveSizeGrid(false)}>×</button>
            <h1 className={styles.brandLogo2}>MIRARWEAR</h1>
            <h2 className={styles.gridTitle}>Размерная сетка</h2>
            <img 
              src={product.sizeChart || product.coverPhoto || product.photo}
              alt="Размерная сетка" 
              className={styles.sizeGridImage} 
            />
          </div>
        </div>
      )}
    </div>
  );
}