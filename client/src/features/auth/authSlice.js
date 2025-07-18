import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
   'auth/login',
   async (userData, { rejectWithValue }) => {
      try {
         const res = await axios.post(
            'http://localhost:8000/api/users/login',
            userData
         );
         return res.data; // { user, token }
      } catch (err) {
         return rejectWithValue(
            err.response?.data?.message || 'Eroare necunoscută'
         );
      }
   }
);

const getStoredUser = () => {
   try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
   } catch {
      return null; // dacă JSON e invalid, evită crash-ul
   }
};

const authSlice = createSlice({
   name: 'auth',
   initialState: {
      user: getStoredUser(),
      token: localStorage.getItem('token') || null,
      loading: false,
      error: null,
   },
   reducers: {
      logout: (state) => {
         state.user = null;
         state.token = null;
         localStorage.removeItem('user');
         localStorage.removeItem('token');
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;

            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
         })
         .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Eroare la autentificare';
         });
   },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
