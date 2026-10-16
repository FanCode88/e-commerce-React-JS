import React from 'react';
import { useSearchParams } from 'react-router-dom';
import OrderHistory from '../../components/OrderHistory/OrderHistory';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import AddressManager from '../../components/AddressManager/AddressManager';
import './ProfileDashboard.css';

const ProfileDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'orders';

  const changeTab = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className='profile-container'>
      <aside className='profile-sidebar'>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => changeTab('orders')}>
          Istoric Comenzi
        </button>

        <button className={activeTab === 'password' ? 'active' : ''} onClick={() => changeTab('password')}>
          Schimbă Parola
        </button>

        <button className={activeTab === 'address' ? 'active' : ''} onClick={() => changeTab('address')}>
          Adresa Livrare
        </button>
      </aside>

      <main className='profile-content'>
        {activeTab === 'orders' && <OrderHistory />}
        {activeTab === 'password' && <ChangePassword />}
        {activeTab === 'address' && <AddressManager />}
      </main>
    </div>
  );
};

export default ProfileDashboard;
