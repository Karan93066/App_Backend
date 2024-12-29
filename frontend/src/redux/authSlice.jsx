import { createSlice } from "@reduxjs/toolkit";

// Initialize state with localStorage values
const initialState = {
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null, // user, admin, or subadmin
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, role } = action.payload;
      console.log(token);
      console.log(role);
      state.token = token;
      state.role = role;
      // Save token and role to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    },
    logout(state) {
      state.token = null;
      state.role = null;
      // Remove token and role from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
