import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLocation, setSubLocation, setKeyword } from '../features/userInfo/userInfoSlice.js';
import { userInfoAccommodationData } from '../filtersData.js';

export const useRegionSearch = (currentSection = 0) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 섹션에 따른 네비게이션 함수
  const navigateBasedOnSection = (searchType) => {
    if (currentSection === 0) {
      navigate("/accommodation", { state: { searchType } });
    } else if (currentSection === 1 || currentSection === 2) {
      navigate("/theme", { state: { searchType } });
    } else {
      navigate("/accommodation", { state: { searchType } });
    }
  };

  // 지역 설정 함수
  const setRegionData = (mainRegion, subRegion) => {
    dispatch(setLocation(mainRegion));
    // 섹션 1(테마)에서는 subLocation을 설정하지 않음
    if (currentSection !== 1) {
      dispatch(setSubLocation(subRegion));
    }
    // 지역명 검색 시 keyword를 null로 설정
    dispatch(setKeyword(null));
  };

  const searchRegion = (searchValue) => {
    if (!searchValue) return;
    
    // 두 글자 미만이면 검색하지 않음
    if (searchValue.length < 2) {
      console.log("Search value is less than 2 characters, skipping search");
      return false;
    }
    
    console.log("Searching for region:", searchValue);
    
    // 모든 지역 데이터 준비
    const mainRegions = Object.keys(userInfoAccommodationData.regionDetails);
    
    // 1. 공백으로 분리된 복합 검색 (예: "서울 강남")
    const searchParts = searchValue.split(/\s+/).filter(part => part.length > 0);
    
    if (searchParts.length > 1) {
      const mainRegionPart = searchParts[0];
      const subRegionPart = searchParts[1];
      
      // 시/도 단위 지역 매칭
      const mainRegionMatch = mainRegions.find(region => 
        region === mainRegionPart || region.includes(mainRegionPart) || mainRegionPart.includes(region)
      );
      
      if (mainRegionMatch) {
        const subLocations = userInfoAccommodationData.regionDetails[mainRegionMatch];
        const subRegionMatch = subLocations.find(location => 
          location === subRegionPart || location.includes(subRegionPart) || subRegionPart.includes(location)
        );
        
        if (subRegionMatch) {
          console.log("Found exact match:", mainRegionMatch, subRegionMatch);
          setRegionData(mainRegionMatch, subRegionMatch);
          navigateBasedOnSection('region');
          return true;
        }
      }
    }
    
    // 2. 공백 없는 복합 검색 (예: "서울강남", "부산강서")
    let bestMatch = {
      mainRegion: null,
      subRegion: null,
      matchLength: 0
    };
    
    for (const mainRegion of mainRegions) {
      if (searchValue.startsWith(mainRegion)) {
        const remainingPart = searchValue.substring(mainRegion.length);
        
        if (remainingPart) {
          const subLocations = userInfoAccommodationData.regionDetails[mainRegion];
          
          for (const subLocation of subLocations) {
            if (remainingPart === subLocation) {
              console.log("Found exact match:", mainRegion, subLocation);
              setRegionData(mainRegion, subLocation);
              navigateBasedOnSection('region');
              return true;
            }
            
            if (subLocation.startsWith(remainingPart) || remainingPart.startsWith(subLocation)) {
              const matchLength = Math.min(subLocation.length, remainingPart.length);
              if (matchLength > bestMatch.matchLength) {
                bestMatch = {
                  mainRegion,
                  subRegion: subLocation,
                  matchLength
                };
              }
            }
          }
        }
      }
    }
    
    if (bestMatch.mainRegion && bestMatch.subRegion) {
      console.log("Found best partial match:", bestMatch.mainRegion, bestMatch.subRegion);
      setRegionData(bestMatch.mainRegion, bestMatch.subRegion);
      navigateBasedOnSection('region');
      return true;
    }
    
    // 3. 단일 지역 검색 (시/도 또는 시/군/구)
    // 시/도 단위 지역 검색
    const mainRegionMatch = mainRegions.find(region => 
      region === searchValue || region.includes(searchValue) || searchValue.includes(region)
    );
    
    if (mainRegionMatch) {
      console.log("Found main region match:", mainRegionMatch);
      setRegionData(mainRegionMatch, "전체");
      navigateBasedOnSection('region');
      return true;
    }
    
    // 시/군/구 단위 지역 검색
    for (const [mainRegion, subLocations] of Object.entries(userInfoAccommodationData.regionDetails)) {
      const subRegionMatch = subLocations.find(location => 
        location === searchValue || location.includes(searchValue) || searchValue.includes(location)
      );
      
      if (subRegionMatch) {
        console.log("Found sub-region match:", mainRegion, subRegionMatch);
        setRegionData(mainRegion, subRegionMatch);
        navigateBasedOnSection('region');
        return true;
      }
    }
    
    // 4. 부분 매칭 (정확한 매칭이 실패한 경우)
    // 시/도 단위 지역 부분 매칭
    const partialMainRegionMatch = mainRegions.find(region => 
      region.includes(searchValue) || searchValue.includes(region)
    );
    
    if (partialMainRegionMatch) {
      console.log("Found partial main region match:", partialMainRegionMatch);
      setRegionData(partialMainRegionMatch, "전체");
      navigateBasedOnSection('region');
      return true;
    }
    
    // 시/군/구 단위 지역 부분 매칭
    for (const [mainRegion, subLocations] of Object.entries(userInfoAccommodationData.regionDetails)) {
      const partialSubRegionMatch = subLocations.find(location => 
        location.includes(searchValue) || searchValue.includes(location)
      );
      
      if (partialSubRegionMatch) {
        console.log("Found partial sub-region match:", mainRegion, partialSubRegionMatch);
        setRegionData(mainRegion, partialSubRegionMatch);
        navigateBasedOnSection('region');
        return true;
      }
    }
    
    // 5. 지역명이 아닌 경우 키워드 검색
    console.log("No region match found, treating as keyword search");
    dispatch(setLocation(null));
    dispatch(setSubLocation(null));
    dispatch(setKeyword(searchValue));
    
    try {
      navigateBasedOnSection('keyword');
      return false;
    } catch (error) {
      console.error("Navigation error:", error);
      return false;
    }
  };

  return { searchRegion };
}; 