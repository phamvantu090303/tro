import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Lấy user từ localStorage
  token: localStorage.getItem("token") || null, // Lấy token từ localStorage
  admin: JSON.parse(localStorage.getItem("admin")) || null, // Lấy user từ localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("admin", JSON.stringify(state.admin));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
