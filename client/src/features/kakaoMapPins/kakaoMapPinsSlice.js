import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pinList : []
};

const pinListSlice = createSlice({
  name: "pinList",
  initialState,
  reducers: {
    setPinList:(state, action) => { // 카카오 맵 주소 리스트들 (핀s)
        state.pinList = action.payload; 
    }
    
  },
});

export const { setPinList } = pinListSlice.actions;
export default pinListSlice.reducer;
