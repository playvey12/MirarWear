import React from 'react';
import { Outlet } from 'react-router-dom';  
import AdminLayout from '../../components/AdminPagesComp/LayoutComp/AdminLayout';

export default function AdminPageComp() {
  return (
    <AdminLayout>
      <Outlet />  
    </AdminLayout>
  );
}