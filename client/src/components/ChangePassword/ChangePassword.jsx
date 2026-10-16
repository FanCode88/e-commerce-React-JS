import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api';
import './ChangePassword.css';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.currentPassword === '') {
      return toast.error('Introdu parola curentă.');
    }

    if (formData.newPassword.length < 6) {
      return toast.error('Parola trebuie să aibă minim 6 caractere.');
    }

    if (formData.currentPassword === formData.newPassword) {
      return toast.error('Noua parolă trebuie să fie diferită de cea curentă.');
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Noua parolă nu coincide cu confirmarea!');
    }

    try {
      await api.put('/users/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success('Parola a fost actualizată cu succes!', {
        containerId: 'main-toast',
        theme: 'light',
      });

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Eroare la schimbarea parolei', {
        containerId: 'main-toast',
      });
    }
  };

  return (
    <div className='password-container'>
      <h2>Schimbă Parola</h2>

      <form onSubmit={handleSubmit} className='password-form'>
        {/* Parola curentă */}
        <div className='password-input'>
          <input
            type={showPassword.current ? 'text' : 'password'}
            name='currentPassword'
            placeholder='Parola curentă'
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />

          <span className='password-eye' onClick={() => togglePassword('current')}>
            {showPassword.current ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Parola nouă */}
        <div className='password-input'>
          <input
            type={showPassword.new ? 'text' : 'password'}
            name='newPassword'
            placeholder='Parolă nouă'
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <span className='password-eye' onClick={() => togglePassword('new')}>
            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirmare parolă */}
        <div className='password-input'>
          <input
            type={showPassword.confirm ? 'text' : 'password'}
            name='confirmPassword'
            placeholder='Confirmă parola nouă'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <span className='password-eye' onClick={() => togglePassword('confirm')}>
            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type='submit' className='update-password-btn'>
          Actualizează Parola
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
