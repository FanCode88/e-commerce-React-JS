import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. ASYNC THUNK: Ne ocupăm de request și salvăm în localStorage AICI (Side Effects)
export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:8000/api/users/login', userData);

    // Dacă request-ul a reușit, salvăm datele în localStorage chiar aici
    if (res.data?.token && res.data?.user) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }

    return res.data; // Trimite { user, token } către reducer
  } catch (err) {
    // Verificare robustă pentru erori de rețea sau structuri diferite de backend
    const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Eroare la autentificare';

    return rejectWithValue(errorMessage);
  }
});

// Funcție utilitară pentru citirea în siguranță a userului la pornirea aplicației
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null; // Evită crash-ul dacă JSON-ul din browser este corupt
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
        state.error = null; // Resetăm eroarea în caz că a existat una la o încercare anterioară
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Va primi string-ul curat generat de rejectWithValue
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
