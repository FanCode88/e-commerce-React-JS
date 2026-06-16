import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // Folosim iconițele din lucide-react
import './Register.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. Am adăugat confirmPassword în starea formularului
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 2. Stări pentru controlul vizibilității parolelor (ochiul)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // 3. Validare în frontend: verificăm dacă parolele coincid
    if (form.password !== form.confirmPassword) {
      setMessage('❌ Parolele nu coincid!');
      return;
    }

    try {
      // Trimitem la server doar datele de care are nevoie backend-ul (fără confirmPassword)
      const { name, email, password } = form;

      const res = await axios.post('http://localhost:8000/api/users/register', {
        name,
        email,
        password,
      });

      setMessage('✅ Cont creat cu succes!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Eroare la înregistrare');
    }
  };

  return (
    <div className='register-container'>
      <h2 className='register-title'>Register</h2>
      {message && <p className='register-message'>{message}</p>}

      <form onSubmit={handleSubmit} className='register-form'>
        <input type='text' name='name' placeholder='Name' value={form.name} onChange={handleChange} required />

        <input type='email' name='email' placeholder='Email' value={form.email} onChange={handleChange} required />

        {/* Câmpul pentru Parolă + Ochi */}
        <div className='password-field-container'>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            placeholder='Password'
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type='button' className='toggle-password-btn' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Câmpul pentru Confirmare Parolă + Ochi */}
        <div className='password-field-container'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name='confirmPassword'
            placeholder='Confirm Password'
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type='button' className='toggle-password-btn' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type='submit' className='register-submit-btn'>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
