import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './AddProduct.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
   const { user, token } = useSelector((state) => state.auth);

   const [formData, setFormData] = useState({
      name: '',
      brand: '',
      price: '',
      description: '',
      size: '',
      image: null,
      countInStock: '',
      category: '',
   });

   if (!token || !user?.isAdmin) {
      return <Navigate to='/' replace />;
   }

   const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === 'image') {
         setFormData((prevData) => ({
            ...prevData,
            image: files,
         }));
      } else {
         setFormData((prevData) => ({
            ...prevData,
            [name]: value,
         }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.name || !formData.price || !formData.image?.length) {
         toast.error('Completează toate câmpurile obligatorii.');
         return;
      }

      const sizesArray = formData.size
         .split(',')
         .map((s) => s.trim())
         .filter(Boolean);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('brand', formData.brand);
      data.append('price', Number(formData.price));
      data.append('description', formData.description);
      data.append('countInStock', Number(formData.countInStock));
      data.append('category', formData.category);

      sizesArray.forEach((s) => data.append('size', s));

      for (let i = 0; i < formData.image.length; i++) {
         data.append('images', formData.image[i]);
      }

      try {
         await axios.post('http://localhost:8000/api/products', data, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
            },
         });
         toast.success('Produs adăugat cu succes!');
         setFormData({
            name: '',
            brand: '',
            price: '',
            description: '',
            size: '',
            image: null,
            countInStock: '',
            category: '',
         });
      } catch (err) {
         toast.error(
            err.response?.data?.message || 'Eroare la adăugarea produsului.'
         );
      }
   };

   return (
      <div className='add-product-container'>
         <h2>Adaugă produs nou</h2>
         <form onSubmit={handleSubmit} encType='multipart/form-data'>
            <label>Nume produs:</label>
            <input
               type='text'
               name='name'
               value={formData.name}
               onChange={handleChange}
               required
            />
            <label>Brand:</label>
            <input
               type='text'
               name='brand'
               value={formData.brand}
               onChange={handleChange}
            />
            <label>Preț:</label>
            <input
               type='number'
               name='price'
               value={formData.price}
               onChange={handleChange}
               required
            />
            <label>Descriere:</label>
            <textarea
               name='description'
               value={formData.description}
               onChange={handleChange}
            />
            <label>Mărimi (separate prin virgulă):</label>
            <input
               type='text'
               name='size'
               value={formData.size}
               onChange={handleChange}
            />
            <label>Imagine:</label>
            <input
               type='file'
               name='image'
               accept='image/*'
               multiple
               onChange={handleChange}
               required
            />
            <label>Stoc:</label>
            <input
               type='number'
               name='countInStock'
               value={formData.countInStock}
               onChange={handleChange}
            />
            <label>Categorie:</label>
            <select
               name='category'
               value={formData.category}
               onChange={handleChange}
               required
            >
               <option value='' disabled>
                  Selectează o categorie
               </option>
               <option value='men'>Men</option>
               <option value='women'>Women</option>
               <option value='children'>Children</option>
            </select>

            <button type='submit'>Add product</button>
         </form>
         <ToastContainer position='bottom-right' autoClose={3000} />
      </div>
   );
};

export default AddProduct;
