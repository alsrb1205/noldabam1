import { createSlice } from "@reduxjs/toolkit";
import getTodayDate from "../../utils/getTodayDate.js";

const [today, tomorrow] = getTodayDate(); // 오늘 날짜와 내일 날짜

const initialState = {
  userCount: 1, // 인원수
  location:"", // 지역
  subLocation:"", // 시, 군, 구 지역
  firstDate: today,
  lastDate: tomorrow,  
  accommodationType: "전체", // 숙박 유형
  themeType: "전체", // 공연 유형
  keyword: "",
  inputValue: "", // 검색창 입력값
  // category:"숙박" //숙박 or 테마 // toggleSlice에 저장했습니다.(삭제해야 함.)
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserCount: (state, action) => { // 인원수
      state.userCount = action.payload;
    },
    setLocation: (state, action) => { //지역
      state.location = action.payload;
    },
    setSubLocation: (state, action) => { // 서브 지역
      state.subLocation = action.payload;
    },
    setFirstDate: (state, action) => { //시작 날짜
      state.firstDate = action.payload;
    },
    setLastDate: (state, action) => { //마지막 날짜
      state.lastDate = action.payload;
    },

    setAccommodationType: (state, action) => { // 숙박 유형
      state.accommodationType = action.payload;
    },
    setThemeType: (state, action) => { // 공연 유형
      state.themeType = action.payload;
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    }
  },
});

export const { 
  setUserCount, 
  setLocation, 
  setSubLocation, 
  setFirstDate, 
  setLastDate, 
  setAccommodationType, 
  setThemeType, 
  setKeyword, 
  setInputValue 
} = userInfoSlice.actions;
export default userInfoSlice.reducer;
