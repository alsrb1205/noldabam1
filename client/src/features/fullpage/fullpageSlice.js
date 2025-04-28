import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSection: 0,
};

export const fullpageSlice = createSlice({
  name: "fullpage",
  initialState,
  reducers: {
    setCurrentSection: (state, action) => {
      state.currentSection = action.payload;
    },
  },
});

export const { setCurrentSection } = fullpageSlice.actions;
export default fullpageSlice.reducer; 