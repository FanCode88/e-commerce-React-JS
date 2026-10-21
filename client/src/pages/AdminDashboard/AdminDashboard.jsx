import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./AdminDashboard.css";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/orders?page=${pageNumber}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError("Eroare la încărcarea comenzilor în panoul de admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (newStatus === "Cancelled") {
        await axios.delete(`http://localhost:8000/api/orders/cancel/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put(`http://localhost:8000/api/orders/${orderId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      }

      setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)));

      toast.success(`Comanda a fost trecută în stadiul: ${newStatus}`);
    } catch (err) {
      console.error("Eroare la schimbarea statusului:", err.response?.data || err.message);
      toast.error("Nu s-a putut modifica statusul comenzii.");
    }
  };

  if (loading) return <div className="centered-container">Se încarcă panoul admin...</div>;
  if (error) return <div className="centered-container">{error}</div>;

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const sTerm = searchTerm?.toLowerCase() || "";

        const orderId = order?._id?.toLowerCase() || "";
        const orderStatus = order?.status?.toLowerCase() || "";

        const userName = order?.userId?.name?.toLowerCase() || "";
        const userEmail = order?.userId?.email?.toLowerCase() || "";

        return orderId.includes(sTerm) || orderStatus.includes(sTerm) || userName.includes(sTerm) || userEmail.includes(sTerm);
      })
    : [];

  return (
    <div className="admin-container">
      <h2>Panou de Administrare - Comenzi</h2>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Caută după ID comandă, status, nume sau email client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">Nu a fost găsită nicio comandă.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Comandă</th>
                <th>Client / Utilizator</th>
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
                    <strong>#{order?._id ? order._id.slice(-6).toUpperCase() : "N/A"}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{order?.userId?.name || "Utilizator necunoscut"}</strong>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#888" }}>{order?.userId?.email || ""}</div>
                  </td>
                  <td>
                    {order?.items && Array.isArray(order.items) ? (
                      <ul className="admin-order-items-list">
                        {order.items.map((item, index) => (
                          <li key={item?._id || index} className="admin-order-item-card">
                            <div className="item-product-name">{item?.productId?.name || "Produs șters"}</div>
                            <div className="item-product-details">
                              <span>
                                Preț: <strong>{item?.productId?.price ? `${item.productId.price} RON` : "N/A"}</strong>
                              </span>
                              <span>
                                Mărime: <strong>{item?.size || "N/A"}</strong>
                              </span>
                              <span>
                                Cantitate: <strong>{item?.quantity || 1}</strong>
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="error-text">Lipsă date produse</span>
                    )}
                  </td>

                  <td>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString("ro-RO") : "Nespecificată"}</td>
                  <td>
                    <span className={`status-badge ${order?.status?.toLowerCase() || "pending"}`}>{order?.status || "Pending"}</span>
                  </td>
                  <td>
                    <select className="admin-status-select" value={order?.status || "Pending"} onChange={(e) => handleStatusChange(order?._id, e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Butoane de Paginare vizibile permanent */}
      <div
        className="pagination-container"
        style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "2rem", paddingBottom: "1rem" }}
      >
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="pagination-btn"
          style={{
            padding: "8px 16px",
            background: "#1e293b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            cursor: page === 1 ? "not-allowed" : "pointer",
            opacity: page === 1 ? 0.5 : 1,
          }}
        >
          Anterior
        </button>

        <span style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
          Pagina <strong>{page}</strong> din <strong>{pages || 1}</strong>
        </span>

        <button
          disabled={page >= pages}
          onClick={() => setPage((prev) => prev + 1)}
          className="pagination-btn"
          style={{
            padding: "8px 16px",
            background: "#1e293b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            cursor: page >= pages ? "not-allowed" : "pointer",
            opacity: page >= pages ? 0.5 : 1,
          }}
        >
          Următor
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
