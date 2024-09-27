// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import AuthService from '../services/auth.service';
// import toast from 'react-hot-toast';

// const user = JSON.parse(localStorage.getItem('user'));

// export const register = createAsyncThunk('auth/register', async (data, thunkAPI) => {
//   try {
//     const response = await AuthService.register(data);
//     return response.data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//     return thunkAPI.rejectWithValue(message);
//   }
// });

// export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
//   try {
//     const data = await AuthService.login(email, password);
//     // console.log("this is login data auth", data);
//     return { user: data };
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//     toast.error(message);
//     // console.log("this is login data auth erro",error);
//     return thunkAPI.rejectWithValue(message);
//   }
// });
// export const getProfile = createAsyncThunk(AuthService.profile, async (thunkAPI) => {
//   try {
//     const data = await AuthService.profile();
//     return data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//     thunkAPI.dispatch(setMessage(message));
//     return thunkAPI.rejectWithValue(message);
//   }
// });

// const initialState = {
//   isAuthenticated: false,
//   user: null,
//   loading: false,
//   error: null,
//   token: null,
//   profile: {},
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.token = null;
//       state.profile = {};
//       state.loading = false;
//     },
//   },
//   extraReducers: {
//     [login.fulfilled]: (state, action) => {
//       state.isAuthenticated = true;
//       state.user = action.payload.user;
//       if (action.payload.user?.token) {
//         state.token = action.payload.user.token;
//       }
//       state.loading = false;
//       state.error = null;
//     },
//     [login.pending]: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     [login.rejected]: (state, action) => {
//       state.isAuthenticated = false;
//       state.loading = false;
//       state.error = action.payload;
//       state.user = null;
//     },
//     [getProfile.fulfilled]: (state, action) => {
//       state.profile = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     [getProfile.pending]: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     [getProfile.rejected]: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
