import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';

const LoginPage = () => {
   const [form, setForm] = useState({ email: '', password: '' });
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { token, error } = useSelector((state) => state.auth);

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
         <form onSubmit={handleSubmit} className='login-form'>
            <h2 className='login-title'>Login</h2>
            <input
               type='email'
               placeholder='Email'
               value={form.email}
               onChange={(e) => setForm({ ...form, email: e.target.value })}
               required
            />
            <input
               type='password'
               placeholder='Password'
               value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })}
               required
            />
            <button type='submit' className='login-button'>
               Login
            </button>
         </form>
         <button
            onClick={goToRegister}
            className='register-button'
            type='button'
         >
            Register
         </button>
         {error && <p className='error-text'>{error}</p>}
      </div>
   );
};

export default LoginPage;
