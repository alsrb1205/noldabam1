import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setKeyword, setLocation, setSubLocation } from "../features/userInfo/userInfoSlice";
import { userInfoAccommodationData } from "../filtersData.js";

export const useSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const keyword = useSelector((state) => state.userInfo.keyword);

  const handleSearch = (searchValue) => {
    // 지역 검색 로직
    const isRegion = Object.values(userInfoAccommodationData.regionDetails).flat().some(
      (location) => location.includes(searchValue) || searchValue.includes(location)
    );

    if (isRegion) {
      // 시/도 단위 지역 검색
      const mainRegion = Object.keys(userInfoAccommodationData.regionDetails).find((region) =>
        region.includes(searchValue) || searchValue.includes(region)
      );

      if (mainRegion) {
        dispatch(setLocation(mainRegion));
        // 시/군/구 단위 지역 검색
        const subRegion = userInfoAccommodationData.regionDetails[mainRegion].find(
          (location) => location.includes(searchValue) || searchValue.includes(location)
        );
        dispatch(setSubLocation(subRegion || "전체"));
        navigate("/accommodation");
        return;
      }
    }

    // 숙소명 검색 로직
    dispatch(setKeyword(searchValue));
    navigate("/accommodation");
  };

  return { handleSearch, keyword };
};

