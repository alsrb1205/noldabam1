import { useSelector, useDispatch } from "react-redux";
import { weatherBannerImages } from '../filtersData.js';
import { setWeather, setTemp } from '../features/weather/weatherSlice.js';
import { fetchWeatherByLocation } from '../services/weatherApi.js';
import { locationMap } from '../filtersData.js';

// 🔥 날짜 포맷 유틸 함수
const formatDate = (dateString) => {
  if (!dateString) return "";
  if (typeof dateString === "string" && dateString.includes("T")) {
    return dateString.slice(0, 10); // "2025-04-27T09:09:23.782Z" → "2025-04-27"
  }
  return dateString;
};

export default function useWeather() {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather.weather);
  const temp = useSelector((state) => state.weather.temp);
  const location = useSelector((state) => state.userInfo.location);
  const firstDate = useSelector((state) => state.userInfo.firstDate);

  // 🔥 날씨 데이터 가져오기
  const fetchWeather = async () => {
    if (!location || !firstDate) return null;

    const englishLocation = locationMap[location] || location;
    const formattedDate = formatDate(firstDate);

    const forecast = await fetchWeatherByLocation(englishLocation, formattedDate);

    if (forecast) {
      if (forecast.day?.condition?.text) {
        dispatch(setWeather(forecast.day.condition.text));
      }
      if (forecast.day?.avgtemp_c !== undefined) {
        dispatch(setTemp(forecast.day.avgtemp_c));
      }
    }

    return forecast;
  };

  // 🔥 날씨 텍스트에 따른 이미지 선택
  const getImageByWeather = () => {
    if (!weather) return weatherBannerImages.sunny; // ✅ 안전 처리

    if (weather.includes("근처 곳곳에 비") || weather.includes("비") || weather.includes("폭우") || weather.includes("소나기")) {
      return weatherBannerImages.rainy;
    }
    if (weather.includes("구름") || weather.includes("흐린")) {
      return weatherBannerImages.cloudy;
    }
    if (weather.includes("눈") || weather.includes("눈보라") || weather.includes("폭설")) {
      return weatherBannerImages.snowy;
    }
    if (weather.includes("대체로 맑음") || weather.includes("부분적으로 맑음")) {
      return weatherBannerImages.mostlySunny;
    }
    if (weather.includes("맑음") || weather.includes("화창")) {
      return weatherBannerImages.sunny;
    }
    return weatherBannerImages.sunny; // 기본값
  };

  return { 
    weather, 
    temp, 
    location, 
    fetchWeather, 
    getImageByWeather 
  };
}
