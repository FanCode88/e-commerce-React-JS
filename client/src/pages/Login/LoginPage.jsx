import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Importăm ochiul pentru consistență
import '../Login/Login.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // Stare pentru vizibilitate parolă

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  useEffect(() => {
    if (token) {
      navigate('/products');
    }
  }, [token, navigate]);

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className='login-container'>
      <h2 className='login-title'>Login</h2>

      <form onSubmit={handleSubmit} className='login-form'>
        <input type='email' name='email' placeholder='Email' value={form.email} onChange={handleChange} required />

        {/* Câmpul de Parolă + Ochi integrat */}
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

        <button type='submit' className='login-button'>
          Login
        </button>
      </form>

      {/* Butonul de redirecționare și textul de eroare grupate curat jos */}
      <button onClick={goToRegister} className='register-button' type='button'>
        Register
      </button>

      {error && <p className='error-text'>{error}</p>}
    </div>
  );
};

export default LoginPage;
