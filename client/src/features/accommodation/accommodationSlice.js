// store/accommodationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],        // 숙박 리스트 누적
  page: 1,         // 현재 페이지 번호
  hasMore: true,   // 더 불러올 데이터가 있는지 여부
  loading: false
};

const accommodationSlice = createSlice({
  name: "accommodation",
  initialState,
  reducers: {
    appendList(state, action) {
      state.list = state.list.concat(action.payload); // 누적
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setHasMore(state, action) {
      state.hasMore = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;

    },
    resetList(state) {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
    }
  }
});

export const {
  appendList,
  setPage,
  setHasMore,
  setLoading,
  resetList
} = accommodationSlice.actions;

export default accommodationSlice.reducer;

