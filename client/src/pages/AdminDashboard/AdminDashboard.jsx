import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './AdminDashboard.css'; // Asigură-te că ai și fișierul de CSS importat corect
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      setError('Eroare la încărcarea comenzilor în panoul de admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // 1. Dacă admin-ul selectează "Cancelled", folosim ruta ta exactă cu metoda DELETE
      if (newStatus === 'Cancelled') {
        await axios.delete(`http://localhost:8000/api/orders/cancel/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // 2. Pentru restul statusurilor (Pending, Shipped, etc.), dacă ai sau vei face o rută generală de PUT:
        await axios.put(
          `http://localhost:8000/api/orders/${orderId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Actualizăm interfața ca să se schimbe culoarea badge-ului pe ecran
      setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)));

      toast.success(`Comanda a fost trecută în stadiul: ${newStatus}`);
    } catch (err) {
      console.error('Eroare la schimbarea statusului:', err.response?.data || err.message);
      toast.error('Nu s-a putut modifica statusul comenzii.');
    }
  };

  if (loading) return <div className='centered-container'>Se încarcă panoul admin...</div>;
  if (error) return <div className='centered-container'>{error}</div>;

  /* =========================================================================
     🔥 CORECTARE ERORARE LINIA 65 (Filtrare securizată cu Optional Chaining)
     ========================================================================= */
  const filteredOrders = orders.filter((order) => {
    const sTerm = searchTerm?.toLowerCase() || '';

    // Căutăm în ID-ul comenzii
    const orderId = order?._id?.toLowerCase() || '';

    // Căutăm în statusul comenzii (dacă nu există status, punem string gol '')
    const orderStatus = order?.status?.toLowerCase() || '';

    // Căutăm în ID-ul utilizatorului
    const userId = order?.userId?.toLowerCase() || '';

    return orderId.includes(sTerm) || orderStatus.includes(sTerm) || userId.includes(sTerm);
  });

  return (
    <div className='admin-container'>
      <h2>Panou de Administrare - Comenzi</h2>

      {/* Input de căutare */}
      <div className='search-bar-container'>
        <input
          type='text'
          placeholder='Caută după ID comandă, status sau ID utilizator...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='admin-search-input'
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className='no-orders'>Nu a fost găsită nicio comandă.</p>
      ) : (
        <div className='admin-table-wrapper'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>ID Comandă</th>
                <th>ID Utilizator</th>
                <th>Produse cumpărate (Detalii)</th>
                <th>Dată Comandă</th>
                <th>Status</th>
                <th>Acțiuni Admin</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order?._id}>
                  <td>
                    <strong>{order?._id}</strong>
                  </td>
                  <td>{order?.userId || 'Utilizator anonim'}</td>
                  <td>
                    {/* Măsură de siguranță: Verificăm dacă items există și este array */}
                    {order?.items && Array.isArray(order.items) ? (
                      <ul className='admin-order-items-list'>
                        {order.items.map((item, index) => (
                          <li key={item?._id || index}>
                            {/* Dacă ai dat .populate() pe backend, poți citi item.productId.name */}
                            <span>Cod Produs: {item?.productId?._id || item?.productId}</span> |
                            <span>
                              {' '}
                              Mărime: <strong>{item?.size || 'N/A'}</strong>
                            </span>{' '}
                            |<span> Cantitate: {item?.quantity || 1}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className='error-text'>Lipsă date produse</span>
                    )}
                  </td>
                  <td>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString('ro-RO') : 'Nespecificată'}</td>
                  <td>
                    {/* Afișează statusul cu litere mici sau text implicit în mod securizat */}
                    <span className={`status-badge ${order?.status?.toLowerCase() || 'pending'}`}>{order?.status || 'Pending'}</span>
                  </td>
                  <td>
                    <select
                      className='admin-status-select'
                      value={order?.status || 'Pending'}
                      onChange={(e) => handleStatusChange(order?._id, e.target.value)}
                    >
                      <option value='Pending'>Pending</option>
                      <option value='Processing'>Processing</option>
                      <option value='Shipped'>Shipped</option>
                      <option value='Delivered'>Delivered</option>
                      <option value='Cancelled'>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
