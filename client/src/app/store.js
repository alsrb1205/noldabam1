import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice.js";
import modalSlice from "../features/modal/modalSlice.js";
import headerSlice from "../features/header/headerSlice.js";
import toggleSlice from '../features/toggle/toggleSlice.js';
import userInfoSlice from '../features/userInfo/userInfoSlice.js';
import weatherSlice from '../features/weather/weatherSlice.js';
import pinListSlice from "../features/kakaoMapPins/kakaoMapPinsSlice.js";
import getTodayDate from "../utils/getTodayDate.js";
import accommodationSlice from "../features/accommodation/accommodationSlice.js";
import fullpageReducer from "../features/fullpage/fullpageSlice";
import couponSlice from '../features/coupons/couponSlice.js';

const [today, tomorrow] = getTodayDate(); // 오늘 날짜와 내일 날짜를 가져옵니다.
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error("Redux 상태 로드 실패:", error);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    login: authSlice,
    modal: modalSlice,
    header: headerSlice,
    toggle: toggleSlice, // 숙박 or 테마 선택
    userInfo: userInfoSlice,
    weather: weatherSlice,
    pinList: pinListSlice,
    accommodation: accommodationSlice,
    fullpage: fullpageReducer,
    coupon: couponSlice,
  },
  preloadedState: loadState(),
});

//로컬 스토리지에 리덕스 상태값 저장하기
store.subscribe(() => {
  try {
    const state = store.getState();

    // userInfo에서 제외리스트
    const filteredState = {
      ...state,
      userInfo: {
        ...state.userInfo,
        firstDate: today.toISOString(),
        lastDate: tomorrow.toISOString(),
        keyword: "",
        userCount:1,    
        inputValue: "",
        accommodationType: "전체",
        themeType: "전체",
      },
      accommodation: {
        list: [],        // 리스트는 비움
        page: 1,         // 기본값
        hasMore: true,
        loading: false
      }
    };
    

    const serializedState = JSON.stringify(filteredState);
    localStorage.setItem("reduxState", serializedState);
  } catch (error) {
    console.error("Redux 상태 저장 실패:", error);
  }
});

// 이 코드는 Redux 상태를 로컬 스토리지(localStorage)에 저장하고, 애플리케이션을 새로고침해도 Redux 상태를 유지하기 위한 용도로 사용됩니다.

