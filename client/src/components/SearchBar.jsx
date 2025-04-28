import { useLocation, useNavigate } from "react-router-dom";
import PeopleCounter from "./common/PeopleCounter";
import Calendar from "./common/Calendar";
import { useSelector, useDispatch } from "react-redux";
import {
  setKeyword,
  setUserCount,
  setLocation,
  setSubLocation,
  setInputValue,
  setThemeType
} from "../features/userInfo/userInfoSlice";
import { userInfoAccommodationData } from "../filtersData.js";
import { setCurrentSection } from "../features/fullpage/fullpageSlice";
import { useEffect, useState, useRef } from "react";
import { useRegionSearch } from "../hooks/useRegionSearch";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

export default function SearchBar({ searchOpen, setSearchOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userCount = useSelector((state) => state.userInfo.userCount);
  const keyword = useSelector((state) => state.userInfo.keyword);
  const currentSection = useSelector((state) => state.fullpage.currentSection);
  const inputValue = useSelector((state) => state.userInfo.inputValue);
  const inputRef = useRef(null);



  // 자동완성을 위한 상태 추가
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 지역 검색 훅 사용
  const { searchRegion } = useRegionSearch(currentSection);

  // 지역명 목록 가져오기
  const regionList = userInfoAccommodationData.region.options;
  const subRegionList = Object.values(
    userInfoAccommodationData.regionDetails
  ).flat();
  const allRegions = [...regionList, ...subRegionList];

  // 홈으로 돌아올 때 섹션 초기화
  useEffect(() => {
    if (location.pathname === "/") {
      dispatch(setCurrentSection(0));
      dispatch(setLocation("전체"));
      dispatch(setSubLocation("전체"));
      dispatch(setThemeType("전체"));
    }
  }, [location.pathname, dispatch]);

  // 검색창이 열릴 때 입력 필드에 포커스
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // 화면 크기가 변경될 때 모바일 검색바 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && searchOpen && setSearchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [searchOpen, setSearchOpen]);

  // 입력값 변경 시 자동완성 제안 업데이트
  const handleInputChange = (e) => {
    const value = e.target.value;
    dispatch(setInputValue(value));

    if (value.trim().length > 0) {
      // 모든 지역명을 상위 지역명과 함께 저장
      const suggestionsWithParent = [];

      // 시/도 단위 지역 검색
      const mainRegions = Object.keys(userInfoAccommodationData.regionDetails);
      mainRegions.forEach((mainRegion) => {
        // "전체" 항목 제외
        if (mainRegion === "전체") return;

        // 정확한 일치 또는 유사어 일치 확인
        if (mainRegion.toLowerCase().includes(value.toLowerCase())) {
          suggestionsWithParent.push({
            display: mainRegion,
            value: mainRegion,
            isMainRegion: true,
          });

          // 상위 지역이 정확히 일치하면 해당 지역의 하위 지역들도 추가
          if (mainRegion.toLowerCase() === value.toLowerCase()) {
            const subLocations =
              userInfoAccommodationData.regionDetails[mainRegion] || [];
            subLocations.forEach((subLocation) => {
              // "전체" 하위 지역 제외
              if (subLocation === "전체") return;

              suggestionsWithParent.push({
                display: `${mainRegion} ${subLocation}`,
                value: subLocation,
                mainRegion: mainRegion,
                isMainRegion: false,
              });
            });
          }
        }
      });

      // 시/군/구 단위 지역 검색 (상위 지역명 포함)
      for (const [mainRegion, subLocations] of Object.entries(
        userInfoAccommodationData.regionDetails
      )) {
        // "전체" 상위 지역 제외
        if (mainRegion === "전체") continue;

        subLocations.forEach((subLocation) => {
          // "전체" 하위 지역 제외
          if (subLocation === "전체") return;

          // 정확한 일치 또는 유사어 일치 확인
          if (subLocation.toLowerCase().includes(value.toLowerCase())) {
            suggestionsWithParent.push({
              display: `${mainRegion} ${subLocation}`,
              value: subLocation,
              mainRegion: mainRegion,
              isMainRegion: false,
            });
          }
        });
      }

      setSuggestions(suggestionsWithParent);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 제안된 지역명 클릭 시 처리
  const handleSuggestionClick = (suggestion) => {
    dispatch(setInputValue(suggestion.display));
    setShowSuggestions(false);

    // 검색 로직 호출
    const searchEvent = { preventDefault: () => {} };
    document.querySelector('input[type="text"]').value = suggestion.display;
    handleSearch(searchEvent);
  };

  // 외부 클릭 시 자동완성 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 드롭다운 스크롤 이벤트 처리
  useEffect(() => {
    const handleWheelEvent = (e) => {
      // 드롭다운 내부에서 스크롤 이벤트가 발생한 경우
      if (e.target.closest(".suggestions-dropdown")) {
        // 스크롤 이벤트가 상위로 전파되는 것을 방지
        e.stopPropagation();
        e.preventDefault();
      }
    };

    // wheel 이벤트 리스너 추가
    document.addEventListener("wheel", handleWheelEvent, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheelEvent);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = document
      .querySelector('input[type="text"]')
      .value.trim();

    if (!searchValue) toast.error("검색어를 입력해주세요");

    if (searchValue.length < 2) toast.error("검색어를 2글자 이상 입력해주세요");

    // 테마 검색 시 선택된 지역과 공연 유형 초기화
    if (currentSection === 1 || currentSection === 2) {
      dispatch(setLocation("전체"));
      dispatch(setSubLocation("전체"));
      dispatch(setThemeType("전체"));
    }

    // 지역 검색 훅 사용
    searchRegion(searchValue);
    setShowSuggestions(false);
    
    // 검색 후 모바일 검색창 닫기
    if (setSearchOpen) {
      setSearchOpen(false);
    }
  };

  // 모바일 검색 오버레이
  const mobileSearchOverlay = searchOpen && (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start text-black bg-black bg-opacity-50 md:hidden">
      <div className="w-full bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">검색</h2>
          <button 
            onClick={() => setSearchOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="relative">
          <form
            className="flex flex-col w-full gap-4 p-4"
            onSubmit={handleSearch}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={
                currentSection === 0
                  ? "지역 또는 숙소명을 입력하세요"
                  : "공연 또는 지역을 입력하세요"
              }
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
            />
            {location.pathname === "/" && currentSection === 0 && (
              <div className="flex gap-2">
                <Calendar
                  className="w-[140px] p-[11px] rounded-xl border-gray-300 text-[14px]"
                />
                <PeopleCounter
                  value={userCount}
                  onChange={(val) => dispatch(setUserCount(val))}
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              검색
            </button>
          </form>
          {/* 모바일 자동완성 드롭다운 */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute top-[70px]  left-0 z-50 w-full p-2 mt-1 overflow-y-auto text-black bg-white border border-gray-300 shadow-lg rounded-xl max-h-60 suggestions-dropdown overscroll-contain touch-pan-y"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative search-container">
        <form
          className="flex-row items-center hidden w-full max-w-4xl gap-4 p-[8px] mx-auto text-black bg-white border shadow rounded-2xl md:flex"
          onSubmit={handleSearch}
        >
          {/* 검색어 입력 */}
          <input
            type="text"
            placeholder={
              currentSection === 0
                ? "지역 또는 숙소명을 입력하세요"
                : "공연 또는 지역을 입력하세요"
            }
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 w-full p-[11px] text-[14px] border border-gray-300 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e);
              }
            }}
          />
          {location.pathname === "/" && currentSection === 0 && (
            <>
              <Calendar className="w-[140px] p-[11px] rounded-xl border-gray-300 text-[14px]" />
              <PeopleCounter
                value={userCount}
                onChange={(val) => dispatch(setUserCount(val))}
              />
            </>
          )}
          {/* 검색 버튼 */}
          <button
            type="button"
            className="px-[20px] py-[10px] text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
            onClick={handleSearch}
          >
            검색
          </button>
        </form>

        {/* 데스크톱 자동완성 드롭다운 */}
        {showSuggestions && suggestions.length > 0 && !searchOpen && (
          <div
            className={`absolute hidden md:block
              ${
                currentSection === 0
                  ? "left-[120px]"
                  : location.pathname === "/accommodation" ||
                    location.pathname === "/theme"
                  ? "left-[120px]"
                  : "left-[120px]"
              }
               z-50 w-[234px] mt-1 overflow-y-auto text-black -translate-x-1/2 bg-white border border-gray-300 shadow-lg rounded-xl max-h-60 suggestions-dropdown overscroll-contain touch-pan-y`}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.display}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 모바일 검색 오버레이 */}
      {mobileSearchOverlay}
    </>
  );
}
