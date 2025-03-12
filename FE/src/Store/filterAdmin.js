import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("authorization") || null, // Lấy token từ localStorage
  admin: JSON.parse(localStorage.getItem("admin")) || null,
};

const authSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    loginAdmin: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("authorization", state.token);
      localStorage.setItem("admin", JSON.stringify(state.admin));
    },
    logoutAdmin: (state) => {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("admin");
    },
  },
});

export const { loginAdmin, logoutAdmin } = authSlice.actions;

export default authSlice.reducer;
