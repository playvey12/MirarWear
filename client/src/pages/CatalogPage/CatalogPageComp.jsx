import React, { useState, useEffect } from 'react'
import styles from './CatalogPageComp.module.css'
import CatalogComp from '../../components/CatalogComp/CatalogComp'
import FiltersComp from '../../components/Filters/FiltersComp'

export default function CatalogPageComp() {
  const [isMobile, setIsMobile] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000) 
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isFiltersOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isFiltersOpen])

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen)
  }

  const closeFilters = () => {
    setIsFiltersOpen(false)
  }

  return (
    <div className={styles.container}>
      {isMobile && (
        <button 
          className={styles.mobileFilterButton}
          onClick={toggleFilters}
          aria-label={isFiltersOpen ? 'Закрыть фильтры' : 'Открыть фильтры'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="6" y1="18" x2="18" y2="18" />
          </svg>
         
        </button>
      )}

      <div className={styles.contentWrapper}>
        <div className={styles.catalogSide}>
          <CatalogComp />
        </div>
        
     
        {!isMobile && (
          <aside className={styles.filtersSide}>
            <FiltersComp isMobile={false} />
          </aside>
        )}

      
        {isMobile && isFiltersOpen && (
          <div className={styles.mobileFiltersOverlay}>
            <button 
              className={styles.closeFiltersButton}
              onClick={closeFilters}
              aria-label="Закрыть фильтры"
            >
              ✕
            </button>
            <FiltersComp isMobile={true} onClose={closeFilters} />
          </div>
        )}
      </div>
    </div>
  )
}