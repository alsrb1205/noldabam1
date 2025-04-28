import { 
  setUserCount, 
  setLocation, 
  setSubLocation, 
  setFirstDate, 
  setLastDate, 
  setAccommodationType, 
  setThemeType 
} from "../features/userInfo/userInfoSlice.js";
import { setTemp, setWeather } from "../features/weather/weatherSlice.js";
import { fetchWeatherByLocation } from "./weatherApi.js";
import { locationMap } from "../filtersData.js";

export const setUserInfo = async (dispatch, { userCount, location, subLocation, firstDate, lastDate, type, category }) => {
  if (userCount !== undefined) dispatch(setUserCount(userCount));
  if (location) dispatch(setLocation(location));
  if (subLocation) dispatch(setSubLocation(subLocation));
  if (firstDate) dispatch(setFirstDate(firstDate));
  if (lastDate) dispatch(setLastDate(lastDate));
  
  // 카테고리에 따라 적절한 타입 설정
  if (type) {
    if (category === "accommodation") {
      dispatch(setAccommodationType(type || "전체"));
    } else {
      dispatch(setThemeType(type || "전체"));
    }
  }

  // // 날씨는 마지막에 비동기로 처리
  // if (location && firstDate) {
  //   const englishLocation = locationMap[location] || location;
  //   const weatherData = await fetchWeatherByLocation(englishLocation, firstDate);
  //   if (weatherData?.day?.condition?.text) {
  //     dispatch(setWeather(weatherData.day.condition.text));
  //   }
  //   if (weatherData?.day?.condition?.icon) {
  //     dispatch(setTemp(weatherData.day.condition.icon));
  //   }
  // }
};
