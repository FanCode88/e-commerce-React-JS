import React, { useState, useEffect } from 'react';
import api from '../../api';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log('URL-ul API-ului este:', api.defaults.baseURL);
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Eroare la încărcarea comenzilor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className='loading-state'>Se încarcă istoricul comenzilor...</div>;
  }

  return (
    <div className='order-history-wrapper'>
      <h2>Istoricul Comenzilor</h2>

      {orders.length === 0 ? (
        <p className='no-orders'>Nu ai nicio comandă înregistrată până acum.</p>
      ) : (
        <table className='orders-table'>
          <thead>
            <tr>
              <th>ID Comandă</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6).toUpperCase()}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('ro-RO')}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </td>
                <td>{order.total} RON</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
