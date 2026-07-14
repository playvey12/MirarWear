import React, { useState, useRef } from 'react';
import styles from './ModalWindowForAddItem.module.css';

const categories = [
  { name: 'ХУДИ / ЗИП-ХУДИ', value: 'hoodies' },
  { name: 'ФУТБОЛКИ / ЛОНГСЛИВЫ', value: 'tshirts' },
  { name: 'ШТАНЫ', value: 'pants' },
  { name: 'ШОРТЫ', value: 'shorts' },
  { name: 'СУМКИ', value: 'bags' },
  { name: 'АКСЕССУАРЫ', value: 'accessories' },
];

export default function ModalWindowForAddItem({ onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    category: 'hoodies',
    brand: 'MIRARWEAR',
    description: '',
    fit: '',
    material: '',
    inStock: true,
    isNew: false,
    isSale: false
  });

  // Фото обложка
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const coverInputRef = useRef(null);

  // Hover фото (для наведения)
  const [hoverPhoto, setHoverPhoto] = useState(null);
  const [hoverPreview, setHoverPreview] = useState(null);
  const hoverInputRef = useRef(null);

  // Галерея фото (до 8 фото)
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const galleryInputRef = useRef(null);

  // Размерная сетка
  const [sizeChart, setSizeChart] = useState(null);
  const [sizeChartPreview, setSizeChartPreview] = useState(null);
  const sizeChartInputRef = useRef(null);

  // Размеры
  const [sizeInput, setSizeInput] = useState('');
  const [sizesList, setSizesList] = useState([]);

  // Характеристики
  const [featureInput, setFeatureInput] = useState('');
  const [featuresList, setFeaturesList] = useState([]);

  // Цвета
  const [colorInput, setColorInput] = useState('');
  const [colorsList, setColorsList] = useState([]);


  const handleFileChange = (file, setFile, setPreview) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file, setCoverPhoto, setCoverPreview);
  };

  const handleHoverChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file, setHoverPhoto, setHoverPreview);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (galleryPhotos.length + files.length > 8) {
      alert('Максимум 8 фото в галерее');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`Файл ${file.name} не является изображением`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`Файл ${file.name} превышает 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setGalleryPhotos(prev => [...prev, ...validFiles]);

      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSizeChartChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file, setSizeChart, setSizeChartPreview);
  };

  const removeGalleryImage = (index) => {
    setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };


  const handleAddSize = () => {
    if (sizeInput.trim() && !sizesList.includes(sizeInput.trim())) {
      setSizesList(prev => [...prev, sizeInput.trim()]);
      setSizeInput('');
    }
  };

  const handleRemoveSize = (size) => {
    setSizesList(prev => prev.filter(s => s !== size));
  };


  const handleAddFeature = () => {
    if (featureInput.trim() && !featuresList.includes(featureInput.trim())) {
      setFeaturesList(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feature) => {
    setFeaturesList(prev => prev.filter(f => f !== feature));
  };


  const handleAddColor = () => {
    if (colorInput.trim() && !colorsList.includes(colorInput.trim())) {
      setColorsList(prev => [...prev, colorInput.trim()]);
      setColorInput('');
    }
  };

  const handleRemoveColor = (color) => {
    setColorsList(prev => prev.filter(c => c !== color));
  };


  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Введите название товара');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      alert('Введите корректную цену');
      return;
    }
    if (!formData.category) {
      alert('Выберите категорию');
      return;
    }
    if (!coverPhoto) {
      alert('Добавьте обложку товара');
      return;
    }

    try {
      const coverBase64 = await fileToBase64(coverPhoto);
      
      let hoverBase64 = null;
      if (hoverPhoto) {
        hoverBase64 = await fileToBase64(hoverPhoto);
      }
      
      const galleryBase64 = await Promise.all(
        galleryPhotos.map(file => fileToBase64(file))
      );

      let sizeChartBase64 = null;
      if (sizeChart) {
        sizeChartBase64 = await fileToBase64(sizeChart);
      }

      const categoryObj = categories.find(c => c.value === formData.category);
      const categoryName = categoryObj ? categoryObj.name : formData.category;

      const newProduct = {
        id: Date.now(),
        ...formData,
        category: formData.category,
        categoryName: categoryName,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        name: formData.name.trim(),
        description: formData.description || '',
        fit: formData.fit || '',
        material: formData.material || '',
        coverPhoto: coverBase64,
        hoverPhoto: hoverBase64, 
        galleryPhotos: galleryBase64,
        sizeChart: sizeChartBase64,
        sizes: sizesList,
        features: featuresList,
        colors: colorsList,
        createdAt: new Date().toISOString()
      };

      onAddProduct(newProduct);
    } catch (error) {
      console.error('Ошибка при обработке изображений:', error);
      alert('Произошла ошибка при загрузке изображений');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
       
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <h2 className={styles.modalTitle}>Добавить товар</h2>
            <p className={styles.modalSubtitle}>Заполните все обязательные поля</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

     
        <div className={styles.modalContent}>
          <form className={styles.form} onSubmit={handleSubmit}>
    
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}></span>
                <h3 className={styles.sectionTitle}>Основная информация</h3>
              </div>
              <hr className={styles.sectionDivider} />
              
              <div className={styles.formGroup}>
                <label>Название <span className={styles.required}>*</span></label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Введите название товара"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Цена (₽) <span className={styles.required}>*</span></label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Цена"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    min="0"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Старая цена (₽)</label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Старая цена"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, oldPrice: e.target.value }))}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Категория <span className={styles.required}>*</span></label>
                <select
                  className={styles.select}
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Бренд</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="MIRARWEAR"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Описание</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Описание товара"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                />
              </div>
            </div>

        
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}></span>
                <h3 className={styles.sectionTitle}>Фотографии</h3>
              </div>
              <hr className={styles.sectionDivider} />

          
              <div className={styles.formGroup}>
                <label>Обложка товара <span className={styles.required}>*</span></label>
                <div className={styles.fileUploadWrapper}>
                  <button
                    type="button"
                    className={styles.fileUploadBtn}
                    onClick={() => coverInputRef.current.click()}
                  >
                    {coverPreview ? 'Изменить обложку' : ' Загрузить обложку'}
                  </button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    style={{ display: 'none' }}
                    required={!coverPhoto}
                  />
                  {coverPreview && (
                    <div className={styles.previewContainer}>
                      <img src={coverPreview} alt="Обложка" className={styles.previewImage} />
                      <button
                        type="button"
                        className={styles.removePreviewBtn}
                        onClick={() => {
                          setCoverPreview(null);
                          setCoverPhoto(null);
                          if (coverInputRef.current) coverInputRef.current.value = '';
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

       
              <div className={styles.formGroup}>
                <label>Hover фото (отображается при наведении)</label>
                <div className={styles.fileUploadWrapper}>
                  <button
                    type="button"
                    className={styles.fileUploadBtn}
                    onClick={() => hoverInputRef.current.click()}
                  >
                    {hoverPreview ? 'Изменить hover фото' : ' Загрузить hover фото'}
                  </button>
                  <input
                    ref={hoverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleHoverChange}
                    style={{ display: 'none' }}
                  />
                  <span className={styles.hint}>Это фото будет показываться при наведении на товар в каталоге</span>
                  {hoverPreview && (
                    <div className={styles.previewContainer}>
                      <img src={hoverPreview} alt="Hover фото" className={styles.previewImage} />
                      <button
                        type="button"
                        className={styles.removePreviewBtn}
                        onClick={() => {
                          setHoverPreview(null);
                          setHoverPhoto(null);
                          if (hoverInputRef.current) hoverInputRef.current.value = '';
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

       
              <div className={styles.formGroup}>
                <label>Галерея фото (до 8 фото)</label>
                <div className={styles.fileUploadWrapper}>
                  <button
                    type="button"
                    className={styles.fileUploadBtn}
                    onClick={() => galleryInputRef.current.click()}
                  >
                    {galleryPhotos.length > 0 
                      ? ` Добавить еще фото (${galleryPhotos.length}/8)` 
                      : ' Загрузить фото галереи'
                    }
                  </button>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    style={{ display: 'none' }}
                  />
                  <span className={styles.hint}>Рекомендуется: вид спереди, сзади, сбоку, детали</span>
                </div>
                {galleryPreviews.length > 0 && (
                  <div className={styles.galleryPreview}>
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className={styles.galleryItem}>
                        <img src={preview} alt={`Фото ${index + 1}`} className={styles.previewImage} />
                        <button
                          type="button"
                          className={styles.removePreviewBtn}
                          onClick={() => removeGalleryImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

         
              <div className={styles.formGroup}>
                <label>Размерная сетка (таблица размеров)</label>
                <div className={styles.fileUploadWrapper}>
                  <button
                    type="button"
                    className={styles.fileUploadBtn}
                    onClick={() => sizeChartInputRef.current.click()}
                  >
                    {sizeChartPreview ? 'Изменить размерную сетку' : ' Загрузить размерную сетку'}
                  </button>
                  <input
                    ref={sizeChartInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSizeChartChange}
                    style={{ display: 'none' }}
                  />
                  {sizeChartPreview && (
                    <div className={styles.previewContainer}>
                      <img src={sizeChartPreview} alt="Размерная сетка" className={styles.previewImage} />
                      <button
                        type="button"
                        className={styles.removePreviewBtn}
                        onClick={() => {
                          setSizeChartPreview(null);
                          setSizeChart(null);
                          if (sizeChartInputRef.current) sizeChartInputRef.current.value = '';
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

     
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                
                <h3 className={styles.sectionTitle}>Характеристики</h3>
              </div>
              <hr className={styles.sectionDivider} />

              <div className={styles.formGroup}>
                <label>Посадка/Крой</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Например: Свободный, Приталенный"
                  value={formData.fit}
                  onChange={(e) => setFormData(prev => ({ ...prev, fit: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Материал</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Например: Хлопок 100%"
                  value={formData.material}
                  onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Размеры</label>
                <div className={styles.sizeInputWrapper}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Например: S, M, L, XL"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                  />
                  <button 
                    type="button" 
                    className={styles.addBtn}
                    onClick={handleAddSize}
                  >
                    Добавить
                  </button>
                </div>
                {sizesList.length > 0 && (
                  <div className={styles.tagsList}>
                    {sizesList.map(size => (
                      <span key={size} className={styles.tag}>
                        {size}
                        <button
                          type="button"
                          className={styles.removeTagBtn}
                          onClick={() => handleRemoveSize(size)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Цвета</label>
                <div className={styles.sizeInputWrapper}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Например: Черный, Белый"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                  />
                  <button 
                    type="button" 
                    className={styles.addBtn}
                    onClick={handleAddColor}
                  >
                    Добавить
                  </button>
                </div>
                {colorsList.length > 0 && (
                  <div className={styles.tagsList}>
                    {colorsList.map(color => (
                      <span key={color} className={styles.tag}>
                        <span className={styles.colorDot} style={{ backgroundColor: color.toLowerCase() }}></span>
                        {color}
                        <button
                          type="button"
                          className={styles.removeTagBtn}
                          onClick={() => handleRemoveColor(color)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Характеристики</label>
                <div className={styles.sizeInputWrapper}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Например: Хлопок, Утепленная"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button 
                    type="button" 
                    className={styles.addBtn}
                    onClick={handleAddFeature}
                  >
                    Добавить
                  </button>
                </div>
                {featuresList.length > 0 && (
                  <div className={styles.tagsList}>
                    {featuresList.map(feature => (
                      <span key={feature} className={styles.tag}>
                        {feature}
                        <button
                          type="button"
                          className={styles.removeTagBtn}
                          onClick={() => handleRemoveFeature(feature)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

       
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}></span>
                <h3 className={styles.sectionTitle}>Статусы</h3>
              </div>
              <hr className={styles.sectionDivider} />
              
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                  />
                  В наличии
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                  />
                  Новинка
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isSale}
                    onChange={(e) => setFormData(prev => ({ ...prev, isSale: e.target.checked }))}
                  />
                  Скидка
                </label>
              </div>
            </div>

            <hr className={styles.divider} />
            
            <div className={styles.buttonGroup}>
              <button className={styles.submitBtn} type="submit">
                 Добавить товар
              </button>
              <button className={styles.cancelBtn} type="button" onClick={onClose}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}