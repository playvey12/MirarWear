
import React, { useState } from 'react';

import styles from './OrderComp.module.css';
import { useAdmin } from '../../../contexts/AdminContext';

export default function OrderComp() {
  const { activeOrders, updateOrderStatus, deleteOrder, loadingл,orders } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState(null);

  console.log('Все заказы из контекста:', orders);
  console.log('Активные заказы:', activeOrders);

  const getStatusInfo = (status) => {
    const statuses = {
      new: { 
        label: 'Новый', 
        className: styles.statusNew,
        icon: '🟡'
      },
      processing: { 
        label: 'В обработке', 
        className: styles.statusProcessing,
        icon: '🟠'
      },
      shipped: { 
        label: 'Отправлен', 
        className: styles.statusShipped,
        icon: '🔵'
      },
      completed: {
        label: 'Завершён',
        className: styles.statusCompleted,
        icon: '✅'
      },
      cancelled: {
        label: 'Отменён',
        className: styles.statusCancelled,
        icon: '❌'
      }
    };
    return statuses[status] || statuses.new;
  };

  const getStatusOptions = () => {
    return [
      { value: 'new', label: 'Новый' },
      { value: 'processing', label: 'В обработке' },
      { value: 'shipped', label: 'Отправлен' },
      { value: 'completed', label: 'Завершён' },
      { value: 'cancelled', label: 'Отменён' }
    ];
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Ошибка при обновлении статуса заказа');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Удалить этот заказ?')) {
      try {
        await deleteOrder(id);
        if (selectedOrder?.id === id) {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error('Failed to delete order:', error);
        alert('Ошибка при удалении заказа');
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Активные заказы</h1>
          <p className={styles.pageSubtitle}>
            Заказы в работе ({activeOrders.length})
          </p>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✅</div>
          <h3 className={styles.emptyTitle}>Активных заказов нет</h3>
          <p className={styles.emptyText}>Все заказы обработаны или завершены</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {activeOrders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>Заказ #{order.id}</span>
                    <span className={styles.orderDate}>{order.date}</span>
                    <span className={`${styles.statusBadge} ${statusInfo.className}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </div>
                  <div className={styles.orderActions}>
                    <span className={styles.orderTotal}>
                      {order.total.toLocaleString('ru-RU')} ₽
                    </span>
                    <button 
                      className={styles.detailsBtn}
                      onClick={() => handleViewDetails(order)}
                    >
                      {selectedOrder?.id === order.id ? 'Скрыть' : 'Детали'}
                    </button>
                    <select
                      className={styles.statusSelect}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {getStatusOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className={styles.deleteOrderBtn}
                      onClick={() => handleDeleteOrder(order.id)}
                      aria-label="Удалить заказ"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className={styles.orderCustomer}>
                  <span className={styles.customerName}>{order.customer}</span>
                  <span className={styles.customerPhone}>{order.phone}</span>
                  <span className={styles.customerEmail}>{order.email}</span>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className={styles.orderDetails}>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailsSection}>
                        <h4 className={styles.detailsTitle}>Товары</h4>
                        <div className={styles.itemsList}>
                          {order.items.map((item, idx) => (
                            <div key={idx} className={styles.itemRow}>
                              <span className={styles.itemName}>{item.name}</span>
                              <span className={styles.itemSize}>Размер: {item.size}</span>
                              <span className={styles.itemQuantity}>×{item.quantity}</span>
                              <span className={styles.itemPrice}>
                                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.detailsSection}>
                        <h4 className={styles.detailsTitle}>Доставка</h4>
                        <p className={styles.detailsText}>
                          <strong>Адрес:</strong> {order.address}
                        </p>
                        {order.comment && (
                          <p className={styles.detailsText}>
                            <strong>Комментарий:</strong> {order.comment}
                          </p>
                        )}
                        <p className={styles.detailsText}>
                          <strong>Итого:</strong> {order.total.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}