import styles from './AdminDashboard.module.css';
import { useAdmin } from '../../../contexts/AdminContext';

export default function AdminDashboard() {
  const { filteredItems, orders, loading } = useAdmin();

  const ordersArray = Array.isArray(orders) ? orders : [];
  

  const totalOrders = ordersArray.length;
  

  const activeOrdersCount = ordersArray.filter(order => 
    ['new', 'processing', 'shipped'].includes(order.status)
  ).length;
  

  const completedOrdersCount = ordersArray.filter(order => 
    order.status === 'completed'
  ).length;
  

  const cancelledOrdersCount = ordersArray.filter(order => 
    order.status === 'cancelled'
  ).length;

  const totalRevenue = ordersArray.reduce((sum, order) => sum + (order.total || 0), 0);

  const completedRevenue = ordersArray
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  if (loading) {
    return (
      <div>
        <h1 className={styles.pageTitle}>Обзор</h1>
        <p className={styles.pageSubtitle}>Статистика вашего магазина</p>
        <p>Загрузка статистики...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Обзор</h1>
      <p className={styles.pageSubtitle}>Статистика вашего магазина</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{filteredItems?.length || 0}</div>
          <div className={styles.statLabel}>Товаров</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>{totalOrders}</div>
          <div className={styles.statLabel}>Всего заказов</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>{activeOrdersCount}</div>
          <div className={styles.statLabel}>Активных заказов</div>
        </div>

       
      </div>

 
      <div className={styles.statsGrid} style={{ marginTop: '20px' }}>
       

        <div className={styles.statCard}>
          <div className={styles.statNumber}>{cancelledOrdersCount}</div>
          <div className={styles.statLabel}>Отмененных заказов</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {completedRevenue.toLocaleString('ru-RU')} ₽
          </div>
          <div className={styles.statLabel}>Выручка с завершенных</div>
        </div>
      </div>
    </div>
  );
}