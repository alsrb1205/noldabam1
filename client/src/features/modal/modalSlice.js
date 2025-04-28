// store/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isLoginModalOpen: false,
    modalType: "login",
  },
  reducers: {
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.modalType = "login";
    },
    openSignupModal: (state) => {
      state.isLoginModalOpen = true;
      state.modalType = "signup";
    },
    openFindIdModal: (state) => {
      state.isLoginModalOpen = true;
      state.modalType = "findId";
    },
    openFindPwdModal: (state) => {
      state.isLoginModalOpen = true;
      state.modalType = "findPwd";
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
  },
});

export const {
  openLoginModal,
  openSignupModal,
  openFindIdModal,
  openFindPwdModal,
  closeLoginModal,
} = modalSlice.actions;
export default modalSlice.reducer;
