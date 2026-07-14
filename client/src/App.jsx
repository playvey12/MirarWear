import { useState } from 'react';
import styles from './App.module.css';
import "@fontsource/montserrat/200.css"; 
import ProductPage from './pages/ProductPage/ProductPage';
import ProductsProvider from './contexts/ProductsContext';

import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import ErorPageComp from './pages/ErorPage/ErorPageComp';
import CartComp from './components/CartComp/CartComp.jsx';
import CatalogPageComp from './pages/CatalogPage/CatalogPageComp.jsx';
import OrderPageComp from './pages/OrderPage/OrderPageComp.jsx';
import AdminLoginPage from './pages/AdminLogin/AdminLoginPage.jsx';
import AdminPageComp from './pages/AdminPage/AdminPageComp.jsx';
import AdminDashboard from './components/AdminPagesComp/Dashboard/AdminDashboard.jsx';
import ProductsListComp from './components/AdminPagesComp/ProductListPage/ProductListComp.jsx';
import OrderComp from './components/AdminPagesComp/OrderPage/OrderComp.jsx';
import AdminProvider from './contexts/AdminContext.jsx';
import SubmitOrderComp from './components/SubmitOrderComp/SubmitOrderComp.jsx';


function App() {
  return (
    <>
      <section className={styles.header}>
        <BrowserRouter>
          <ProductsProvider>
            <AdminProvider>
            <Routes>
         
              <Route path="/" element={<CatalogPageComp />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartComp />} />
              <Route path="/catalog" element={<CatalogPageComp />} />
              <Route path="/catalog/continue" element={<OrderPageComp />} />
               <Route path="/order/ordersubmit" element={<SubmitOrderComp />} />
              <Route path="/tihonloh/admin/login" element={<AdminLoginPage />} />
              <Route path="/tihonloh/admin" element={<AdminPageComp />}>
              <Route path="/tihonloh/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/tihonloh/admin/products" element={<ProductsListComp />} />
              <Route path="/tihonloh/admin/orders" element={<OrderComp />} />
             


       
              </Route>
              
      
              <Route path="/*" element={<ErorPageComp />} />
            </Routes>
            </AdminProvider>
          </ProductsProvider>
        </BrowserRouter>
      </section>
    </>
  );
}

export default App;