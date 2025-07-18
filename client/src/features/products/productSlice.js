import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch produse din backend
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
   const res = await axios.get('http://localhost:8000/api/products');
   return res.data;
});

const productSlice = createSlice({
   name: 'products',
   initialState: {
      items: [],
      status: 'idle',
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchProducts.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
         });
   },
});

export default productSlice.reducer;
