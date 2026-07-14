import React, { useState, useRef, useEffect } from 'react'
import styles from './FiltersComp.module.css'
import { Link, useNavigate } from 'react-router-dom' 
import "@fontsource/montserrat/200.css"; 

export default function FiltersComp({ isMobile = false, onClose }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef(null);
  
  const categories = [
    { name: 'КОРЗИНА', path: '/cart' },
    { name: 'ХУДИ / ЗИП-ХУДИ', param: 'hoodies' },
    { name: 'ФУТБОЛКИ / ЛОНГСЛИВЫ', param: 'tshirts' },
    { name: 'ШТАНЫ', param: 'pants' },
    { name: 'ШОРТЫ', param: 'shorts' },
    { name: 'СУМКИ', param: 'bags' },
    { name: 'АКСЕССУАРЫ', param: 'accessories' },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  const handleCategoryClick = (param) => {
    navigate(`/catalog?category=${param}`);
    closeMenu();
    if (onClose) {
      onClose();
    }
  }
  
  const handleClearCategoryClick = () => {
    navigate(`/catalog`);
    closeMenu();
    if (onClose) {
      onClose();
    }
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target)) {
        closeMenu();
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);


  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  const showNav = isMobile || isMenuOpen;

  return (
    <div 
      className={`${styles.menuContainer} ${isMobile ? styles.mobileMenu : ''}`} 
      ref={menuContainerRef}
    >
     
      {!isMobile && (
        <div onClick={handleClearCategoryClick} className={styles.menuLogo}>
          MIRARWEAR
        </div>
      )}
      
      {!isMobile && (
        <>

        <button 
          className={`${styles.burgerButton} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
        >
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
        </button>
        </>
      )}
      

      <nav className={`${styles.menuNav} ${showNav ? styles.open : ''}`}>
        {isMobile && (
          <h2 className={styles.mobileMenuTitle}>КАТЕГОРИИ</h2>
        )}
        
        {categories.map((category, index) => {
          const clickHandler = () => {
            closeMenu();
            if (onClose) onClose();
          };

          if (category.path === '/cart') {
            return (
              <Link 
                key={index} 
                to={category.path} 
                className={styles.menuLink}
                onClick={clickHandler}
              >
                {category.name}
              </Link>
            )
          }
          return (
            <div 
              key={index} 
              onClick={() => handleCategoryClick(category.param)}
              className={styles.menuLink}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCategoryClick(category.param);
                }
              }}
            >
              {category.name}
            </div>
          )
        })}
      </nav>
    </div>
  )
}