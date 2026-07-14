import React from 'react'
import styles from './ProductPage.module.css'

import ProductComp from '../../components/ProductComponents/ProductComp'
import RandomClothesComp from '../../components/RandomClothes/RandomClothesComp'

export default function ProductPage() {
  return (
    <>
      <div className={styles.catalogContainer} >
        <ProductComp />
      </div>
      <div className={styles.pullUp}>
        <RandomClothesComp />
      </div>
    </>
  )
}