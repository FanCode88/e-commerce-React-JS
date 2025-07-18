import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // opțional, pentru stiluri

const RegisterPage = () => {
   const navigate = useNavigate();
   const [form, setForm] = useState({
      name: '',
      email: '',
      password: '',
   });
   const [message, setMessage] = useState('');

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage('');

      try {
         const res = await axios.post(
            'http://localhost:8000/api/users/register',
            form
         );
         setMessage('✅ Cont creat cu succes!');
         setTimeout(() => navigate('/login'), 1500); // redirecționează după 1.5 secunde
      } catch (err) {
         setMessage(err.response?.data?.error || '❌ Eroare la înregistrare');
      }
   };

   return (
      <div className='register-container'>
         <h2 className='register-title'>Register</h2>
         {message && <p className='register-message'>{message}</p>}

         <form onSubmit={handleSubmit} className='register-form'>
            <input
               type='text'
               name='name'
               placeholder='Name'
               value={form.name}
               onChange={handleChange}
               required
            />
            <input
               type='email'
               name='email'
               placeholder='Email'
               value={form.email}
               onChange={handleChange}
               required
            />
            <input
               type='password'
               name='password'
               placeholder='Password'
               value={form.password}
               onChange={handleChange}
               required
            />
            <button type='submit'>Register</button>
         </form>
      </div>
   );
};

export default RegisterPage;
