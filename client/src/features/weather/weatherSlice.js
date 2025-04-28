import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    weather: "",
    temp:"",
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeather: (state, action) => {
      state.weather = action.payload;
    },
    setTemp: (state, action) => {
      state.temp = action.payload;
    },
  },
});

export const { setWeather, setTemp } = weatherSlice.actions;
export default weatherSlice.reducer;
