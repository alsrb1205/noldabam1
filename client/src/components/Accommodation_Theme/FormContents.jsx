import { useDispatch, useSelector } from "react-redux";
import Calendar from "../common/Calendar.jsx";
import { weatherTextToIcons } from "../../utils/weatherTextToIcons.js";
import { useForm } from "../../context/FormContext.jsx";
import { useEffect } from "react";
import { setUserInfo } from "../../services/userInfoApi.js";
import { setTemp, setWeather } from "../../features/weather/weatherSlice.js";
import { fetchWeatherByLocation } from '../../services/weatherApi.js';

import {
  setUserCount,
  setAccommodationType,
  setThemeType,
  setLocation,
  setSubLocation,
  setKeyword,
  setInputValue,
  setFirstDate,
  setLastDate
} from "../../features/userInfo/userInfoSlice";

import {
  userInfoAccommodationData,
  userInfoThemeData,
  weatherIcons,
  locationMap
} from "../../filtersData.js";

import { useCategory } from "../../context/CategoryContext.jsx";
import useAccommodationData from "../../hooks/useAccommodationData.js";
import useWeather from "../../hooks/useWeather.js";


export default function FormContents() {
  const category = useSelector((state) => state.toggle.category);
  const isAccommodation = category === "accommodation";

  const dispatch = useDispatch();
  const firstDate = useSelector((state) => state.userInfo.firstDate);
  const lastDate = useSelector((state) => state.userInfo.lastDate);
  const weather = useSelector((state) => state.weather.weather);
  const temp = useSelector((state) => state.weather.temp);
  const iconKey = weatherTextToIcons(weather);
  const icon = weatherIcons[iconKey];
  const data = isAccommodation ? userInfoAccommodationData : userInfoThemeData;
  const { fetchWeather } = useWeather();
  const userCount = useSelector((state) => state.userInfo.userCount);
  const reduxLocation = useSelector((state) => state.userInfo.location);
  const reduxSubLocation = useSelector((state) => state.userInfo.subLocation);
  const reduxType = useSelector((state) =>
    isAccommodation ? state.userInfo.accommodationType : state.userInfo.themeType
  );
  const { selectedRegion, setSelectedRegion, selectedSubRegion, setSelectedSubRegion, localType, setLocalType, localUserCount, setLocalUserCount } = useForm();
  const { setIsOpening } = useCategory();
  const { loading, setLoading } = useAccommodationData();
  useEffect(() => {
    setSelectedRegion(reduxLocation);
    setSelectedSubRegion(reduxSubLocation);
    setLocalType(reduxType);
    setLocalUserCount(userCount);
  }, [reduxLocation, reduxSubLocation, reduxType, userCount]);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);

    if (isAccommodation && data.regionDetails) {
      const defaultSub = data.regionDetails[region]?.[0] || "";
      setSelectedSubRegion(defaultSub);
    } else {
      setSelectedSubRegion("");
    }
  };

  const handleTypeChange = (e) => {
    setLocalType(e.target.value);
  };

  const handleSubRegionChange = (e) => {
    setSelectedSubRegion(e.target.value);
  };

  const handleUserCountChange = (newCount) => {
    setLocalUserCount(newCount);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    dispatch(setLocation(selectedRegion));
    dispatch(setSubLocation(selectedSubRegion));
    dispatch(setKeyword(''));
    dispatch(setInputValue(''));
    dispatch(setUserCount(localUserCount));
    if (isAccommodation) {
      dispatch(setAccommodationType(localType));
    } else {
      dispatch(setThemeType(localType));
    }

    const formData = {
      location: selectedRegion,
      subLocation: selectedSubRegion,
      type: localType,
      userCount: localUserCount,
      category,
      ...(isAccommodation ? { firstDate, lastDate } : {})
    };

    await Promise.all([
      setUserInfo(dispatch, formData),
      fetchWeather()
    ]);

    setIsOpening(false);

    // 검색 후 화면 상단으로 스크롤
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <form
        className="space-y-4"
        onSubmit={handleSearch}>
        <div>
          <label className="block mb-1 text-sm font-semibold">{data.category.label}</label>
          <div className="p-2 text-sm text-gray-500 border rounded bg-gray-50">{category === 'accommodation' ? "숙박" : "테마"}</div>
        </div>
        {/* <div>
          <label className="block mb-1 text-sm font-semibold">날씨</label>
          <div className="p-2 text-sm border rounded bg-gray-50">{selectedRegion} - {weather} {icon}</div>
        </div> */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">지역</label>
          <select
            value={selectedRegion || ""}
            onChange={handleRegionChange}
            className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">지역 선택</option>
            {
              isAccommodation ?
                Object.keys(data.regionDetails).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))
                :
                data.region.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))
            }
          </select>
        </div>

        {isAccommodation && data.regionDetails && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">상세지역</label>
            <select
              value={selectedSubRegion || ""}
              onChange={handleSubRegionChange}
              className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">상세지역 선택</option>
              {data.regionDetails[selectedRegion]?.map((subRegion) => (
                <option key={subRegion} value={subRegion}>
                  {subRegion}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">{data.type.label}</label>
          {selectedRegion ? (
            <select
              value={localType}
              onChange={handleTypeChange}
              className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {data.type.options.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="p-2 text-sm text-gray-500 border rounded bg-gray-50">
              지역을 선택해주세요
            </div>
          )}
        </div>
        {isAccommodation &&
          <>
            <div>
              <label className="text-sm font-semibold text-gray-600">날짜</label>
              <Calendar className="w-full text-sm pl-[11px] pr-[8px] py-[7px] rounded-md" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-500">{data.people.label}</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 text-lg font-bold bg-gray-200 rounded-full"
                  onClick={() => handleUserCountChange(Math.max(1, localUserCount - 1))}
                >
                  -
                </button>
                <span className="text-sm">{localUserCount}명</span>
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 text-lg font-bold bg-gray-200 rounded-full"
                  onClick={() => handleUserCountChange(Math.min(10, localUserCount + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </>
        }

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="px-[20px] py-2 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
          >
            검색
          </button>
        </div>
      </form>
    </>
  );
}