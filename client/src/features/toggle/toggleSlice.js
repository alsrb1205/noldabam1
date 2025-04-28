// src/features/header/headerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: localStorage.getItem("type") || "accommodation", // 새로고침해도 기억됨
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      localStorage.setItem("type", action.payload); // 동기화도 같이
    },
  },
});

export const { setCategory } = toggleSlice.actions;
export default toggleSlice.reducer;
