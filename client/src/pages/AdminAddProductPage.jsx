import React, { useState } from 'react';
import axios from 'axios';

const AdminAddProductPage = () => {
   const [form, setForm] = useState({
      name: '',
      brand: '',
      price: '',
      description: '',
      size: '',
      image: '',
      countInStock: '',
   });

   const [message, setMessage] = useState('');
   const token = localStorage.getItem('token'); // sau din Redux dacă folosești

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const payload = {
            ...form,
            price: Number(form.price),
            countInStock: Number(form.countInStock),
            size: form.size.split(',').map(s => s.trim()), // transformă stringul în array
         };

         const res = await axios.post(
            'http://localhost:8000/api/products',
            payload,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setMessage('✅ Produsul a fost adăugat cu succes!');
         setForm({
            name: '',
            brand: '',
            price: '',
            description: '',
            size: '',
            image: '',
            countInStock: '',
         });
      } catch (err) {
         setMessage('❌ Eroare la adăugarea produsului');
      }
   };

   return (
      <div className="max-w-xl mx-auto p-6">
         <h1 className="text-2xl font-bold mb-4">Adaugă un produs nou</h1>
         {message && <p className="mb-4">{message}</p>}
         <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input name="name" placeholder="Nume" value={form.name} onChange={handleChange} required />
            <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
            <input name="price" placeholder="Preț" value={form.price} onChange={handleChange} type="number" required />
            <textarea name="description" placeholder="Descriere" value={form.description} onChange={handleChange} />
            <input name="size" placeholder="Mărimi (ex: M,L,XL)" value={form.size} onChange={handleChange} />
            <input name="image" placeholder="URL imagine" value={form.image} onChange={handleChange} />
            <input name="countInStock" placeholder="Stoc" value={form.countInStock} onChange={handleChange} type="number" />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Adaugă produs</button>
         </form>
      </div>
   );
};

export default AdminAddProductPage;
