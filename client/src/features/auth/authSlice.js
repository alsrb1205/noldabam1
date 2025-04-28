import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  isError: false,
  justLoggedIn: false,
  isNaverLoggedIn: false,
  user: null,
  token: null,
  recaptchaToken: null,
  allMembers: [],
  membersError: false,
};

export const authSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      if (action.payload.result_rows) {
        state.isLoggedIn = true;
        state.justLoggedIn = true;
      } else {
        state.isError = true;
        state.justLoggedIn = false;
      }
    },
    setIsLogout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.recaptchaToken = null;
    },
    setLoginReset(state) {
      state.isError = false;
      state.justLoggedIn = false;
    },
    setInitialLoginState(state) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const user = localStorage.getItem("user");

      if (token && userId) {
        state.token = token;
        state.user = user ? JSON.parse(user) : null;
        state.isLoggedIn = true;
        state.isError = false;
      } else {
        state.isLoggedIn = false;
        state.isError = false;
      }
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    setNaverLogout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    // reCAPTCHA 토큰 저장 및 초기화 액션
    setRecaptchaToken(state, action) {
      state.recaptchaToken = action.payload;
    },
    resetRecaptchaToken(state) {
      state.recaptchaToken = null;
    },
    setAllMembers(state, action) {
      state.allMembers = action.payload;
      state.membersError = false;
    },
    setMembersError(state, action) {
      state.membersError = action.payload;
    },
  },
});

export const {
  setIsLoggedIn,
  setIsLogout,
  setLoginReset,
  setInitialLoginState,
  setUser,
  setNaverLogout,
  setRecaptchaToken,
  resetRecaptchaToken,
  setAllMembers,
  setMembersError,
} = authSlice.actions;
export default authSlice.reducer;
