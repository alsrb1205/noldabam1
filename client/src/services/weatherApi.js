import axios from "axios";

export const fetchWeatherByLocation = async (location, targetDate = null) => {
  try {
    
    // 예시: OpenWeatherMap API 사용 (API 키는 환경변수에 넣는 걸 권장)
    const apiKey = "a7552404805342f49d780528250104"; // 실제 키로 대체
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10&lang=ko`;
    const response = await axios.get(url);
    const forecastList = response.data.forecast.forecastday;
    console.log(forecastList);
    
    // targetDate가 없으면 현재 날씨 정보 반환
    if (!targetDate) {
      return forecastList[0];
    }
    
    // targetDate가 있으면 해당 날짜의 날씨 정보 찾기
    const matchedForecast = forecastList.find(
      (day) => day.date === targetDate
    );

    return matchedForecast || forecastList[0]; // 해당 날짜가 없으면 현재 날씨 반환
  } catch (error) {
    console.error("날씨 정보를 불러오는 데 실패했습니다:", error);
    return null;
  }
};
