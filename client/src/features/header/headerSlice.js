// src/features/header/headerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: "header",
  initialState: {
    isHeaderToggleOpen: false,
    isHeaderSearchOpen: false,
  },
  reducers: {
    toggleHeaderMenu: (state) => {
      state.isHeaderToggleOpen = !state.isHeaderToggleOpen;
    },
    openHeaderMenu: (state) => {
      state.isHeaderToggleOpen = true;
    },
    closeHeaderMenu: (state) => {
      state.isHeaderToggleOpen = false;
    },
    toggleHeaderSearch: (state) => {
      state.isHeaderSearchOpen = !state.isHeaderSearchOpen;
    },
    openHeaderSearch: (state) => {
      state.isHeaderSearchOpen = true;
    },
    closeHeaderSearch: (state) => {
      state.isHeaderSearchOpen = false;
    },

  },
});

export const { toggleHeaderMenu, openHeaderMenu, closeHeaderMenu, toggleHeaderSearch,openHeaderSearch,closeHeaderSearch } = headerSlice.actions;
export default headerSlice.reducer;
