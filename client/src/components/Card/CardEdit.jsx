import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './CardEdit.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CardEdit = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const token = useSelector((state) => state.auth.token);

   const [product, setProduct] = useState({
      name: '',
      brand: '',
      description: '',
      price: '',
      image: '', // poate fi string sau array
   });

   const [imageFile, setImageFile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const res = await axios.get(
               `http://localhost:8000/api/products/${id}`,
               {
                  headers: { Authorization: `Bearer ${token}` },
               }
            );
            setProduct(res.data);
            setLoading(false);
         } catch {
            setError('Eroare la încărcarea produsului.');
            setLoading(false);
         }
      };
      fetchProduct();
   }, [id, token]);

   const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === 'image') {
         setImageFile(files[0]);
      } else {
         setProduct((prev) => ({
            ...prev,
            [name]: value,
         }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const formData = new FormData();
         formData.append('name', product.name);
         formData.append('brand', product.brand);
         formData.append('description', product.description);
         formData.append('price', product.price);

         if (imageFile) {
            formData.append('image', imageFile);
         } else {
            if (Array.isArray(product.image)) {
               formData.append('image', product.image[0] || '');
            } else {
               formData.append('image', product.image || '');
            }
         }

         await axios.put(`http://localhost:8000/api/products/${id}`, formData, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
            },
         });

         toast.success('Produs actualizat cu succes!');
         setTimeout(() => navigate('/products'), 3000);
      } catch (err) {
         toast.error('Eroare la actualizarea produsului.');
      }
   };

   if (loading) return <p>Se încarcă produsul...</p>;
   if (error) return <p>{error}</p>;

   return (
      <div className='center'>
         <div className='edit-container'>
            <h2>Edit products</h2>
            <form
               className='edit-form'
               onSubmit={handleSubmit}
               encType='multipart/form-data'
            >
               <label>Nume</label>
               <input
                  name='name'
                  value={product.name}
                  onChange={handleChange}
                  required
               />

               <label>Brand</label>
               <input
                  name='brand'
                  value={product.brand}
                  onChange={handleChange}
               />

               <label>Descriere</label>
               <textarea
                  name='description'
                  value={product.description}
                  onChange={handleChange}
               />

               <label>Preț</label>
               <input
                  name='price'
                  type='number'
                  value={product.price}
                  onChange={handleChange}
                  required
               />

               <label>Imagine (selectează fișier nou):</label>
               <input
                  name='image'
                  type='file'
                  accept='image/*'
                  onChange={handleChange}
               />

               {imageFile && <p>Fișier selectat: {imageFile.name}</p>}

               <button type='submit'>Save the changes</button>
            </form>
            <ToastContainer position='bottom-right' autoClose={3000} />
         </div>
      </div>
   );
};

export default CardEdit;
