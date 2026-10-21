import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User, Mail, Shield, Package, ShoppingBag, ArrowRight, KeyRound } from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validări rapide în interfață
    if (!currentPassword || !newPassword) {
      toast.error("Te rugăm să completezi ambele câmpuri!", { containerId: "main-toast" });
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("Noua parolă este prea scurtă! Trebuie să aibă cel puțin 6 caractere.", { containerId: "main-toast" });
      return;
    }

    if (currentPassword === newPassword) {
      toast.warning("Noua parolă este identică cu parola actuală!", { containerId: "main-toast" });
      return;
    }

    try {
      setLoading(true);
      const res = await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success(res.data.message || "Parola a fost schimbată cu succes!", { containerId: "main-toast" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Eroare la schimbarea parolei.";
      toast.error(errorMsg, { containerId: "main-toast" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-cyber">
      <div className="profile-container">
        {/* Antet pagină */}
        <div className="profile-header-section">
          <div>
            <span className="cyber-tag">// PANOU DE CONTROL UTILIZATOR</span>
            <h1>PROFILUL MEU</h1>
          </div>
          <div className="profile-status-badge">
            <span className="status-dot"></span>
            <span>SISTEM ACTIV</span>
          </div>
        </div>

        <div className="profile-grid-layout">
          {/* Coloana Stângă: Detalii + Secțiune Schimbare Parolă */}
          <div className="profile-left-column">
            <div className="profile-main-card">
              <div className="profile-avatar-box">
                <User size={40} />
                <div className="avatar-glow"></div>
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="info-label">
                    <User size={14} /> Nume Complet
                  </span>
                  <p className="info-value">{user?.name || "Nespecificat"}</p>
                </div>

                <div className="profile-info-item">
                  <span className="info-label">
                    <Mail size={14} /> Adresă Email
                  </span>
                  <p className="info-value">{user?.email || "Nespecificat"}</p>
                </div>

                <div className="profile-info-item">
                  <span className="info-label">
                    <Shield size={14} /> Statut Acces
                  </span>
                  <p className={`info-value highlight ${user?.isAdmin ? "admin-glow" : ""}`}>{user?.isAdmin ? "Administrator Sistem" : "Client Standard"}</p>
                </div>
              </div>
            </div>

            {/* FORMULAR SCHIMBARE PAROLĂ */}
            <div className="profile-password-card">
              <h3>
                <KeyRound size={16} /> SECURITATE CONT
              </h3>
              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group-cyber">
                  <label>Parola Actuală</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <div className="form-group-cyber">
                  <label>Parola Nouă (min. 6 caractere)</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <button type="submit" className="cyber-save-btn" disabled={loading}>
                  {loading ? "Se actualizează..." : "ACTUALIZEAZĂ PAROLA"}
                </button>
              </form>
            </div>
          </div>

          {/* Panou Secundar / Scurtături Rapide */}
          <div className="profile-sidebar-panel">
            <h3>ACȚIUNI RAPIDE</h3>
            <div className="profile-quick-links">
              <Link to="/cart" className="quick-link-card">
                <div className="quick-link-icon">
                  <ShoppingBag size={18} />
                </div>
                <div className="quick-link-text">
                  <span>Coșul Meu</span>
                  <p>Vezi produsele selectate</p>
                </div>
                <ArrowRight size={16} className="quick-arrow" />
              </Link>

              <Link to="/products" className="quick-link-card">
                <div className="quick-link-icon">
                  <Package size={18} />
                </div>
                <div className="quick-link-text">
                  <span>Magazin Online</span>
                  <p>Explorează colecția de adidași</p>
                </div>
                <ArrowRight size={16} className="quick-arrow" />
              </Link>

              {user?.isAdmin && (
                <Link to="/admin/dashboard" className="quick-link-card admin-shortcut">
                  <div className="quick-link-icon">
                    <Shield size={18} />
                  </div>
                  <div className="quick-link-text">
                    <span>Panou Admin</span>
                    <p>Gestionează comenzi și produse</p>
                  </div>
                  <ArrowRight size={16} className="quick-arrow" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
