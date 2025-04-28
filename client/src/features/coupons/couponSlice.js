// store/couponSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  couponList: [] // { id: "user123", grade: "GOLD", amount: 10000 }
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setCoupon(state, action) {
        const { id, grade, amount } = action.payload;
      
        // 1. 필수 값 체크
        if (!id || !grade || typeof amount !== "number") {
          console.warn("❌ 잘못된 쿠폰 데이터:", action.payload);
          return;
        }
      
        // 2. 기존 데이터가 있는지 확인 후 업데이트 or 추가
        const existing = state.couponList.find((c) => c.id === id);
      
        if (existing) {
          existing.amount = amount;  // 또는 += amount 로 누적도 가능
          existing.grade = grade;    // 등급 바뀌었을 경우 동기화
        } else {
          state.couponList.push({ id, grade, amount });
        }
      }
      
  }
});

export const { setCoupon } = couponSlice.actions;
export default couponSlice.reducer;
