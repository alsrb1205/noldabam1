import { accommodationSideBarFilters, themeSideBarFilters } from "../../filtersData.js";
import { useSelector } from "react-redux";
import { regionPrefix } from '../../filtersData.js';
import KakaoApiMap from "../kakaoMap/KakaoApiMap.jsx";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import KakaoMapMultiplePins from "../kakaoMap/KakaoMapMultiplePins.jsx";
import UserInfo from "./UserInfo.jsx";

export default function LeftSideBar() {
  const location = useSelector((state) => state.userInfo.location);
  const subLocation = useSelector((state) => state.userInfo.subLocation);
  const category = useSelector((state) => state.toggle.category);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [displayedPins, setDisplayedPins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const addressList = useSelector((state) => state.pinList.pinList) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // 모달이 열릴 때 배경 스크롤 막기
    if (isMapOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMapOpen]);

  // 모달이 열릴 때마다 displayedPins 초기화
  useEffect(() => {
    if (isMapOpen) {
      setCurrentPage(1);
      if (addressList.length > 0) {
        const endIndex = Math.min(itemsPerPage, addressList.length);
        setDisplayedPins(addressList.slice(0, endIndex));
      } else {
        setDisplayedPins([]);
      }
    }
  }, [isMapOpen, addressList]);

  const handleLoadMore = async () => {
    setIsLoading(true);
    setCurrentPage(prev => prev + 1);
    const newDisplayedPins = addressList.slice(0, (currentPage + 1) * itemsPerPage);
    setDisplayedPins(newDisplayedPins);
    
    // 지도 렌더링이 완료될 때까지 로딩 상태 유지
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const fullAddress =
    subLocation === "전체"
      ? location
      : `${regionPrefix[location]} ${subLocation}`;

  return (
    <aside className="hidden w-[280px] flex-shrink-0 pr-6 md:block sticky top-[100px] h-screen overflow-y-auto" >
      {/* ✅ 지도 영역 - 데스크탑에서만 보이도록 분리 */}
      {category === "accommodation" ? <div className="hidden w-full p-4 mb-6 bg-white border shadow md:block rounded-xl">
        <div className="w-full">
          <KakaoApiMap address={category === "accommodation" ? fullAddress : location} />
        </div>

        {category === 'accommodation' && (
          <button
            className="w-full py-2 mt-3 font-semibold text-white bg-blue-500 rounded-md"
            onClick={() => setIsMapOpen(true)}
          >
            지도 보기
          </button>
        )}
      </div> : ""}

      {/* ✅ 지도 모달은 항상 사용 가능 */}
      <Modal
        isOpen={isMapOpen}
        onRequestClose={() => setIsMapOpen(false)}
        contentLabel="전체 지도 보기"
        className="max-w-4xl w-[90vw] bg-white p-6 rounded-xl shadow-lg mx-auto z-40"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        ariaHideApp={false}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">📍 전체 지도 보기</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {displayedPins.length}/{addressList.length}개 표시됨
            </span>
            {displayedPins.length < addressList.length && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                더 보기
              </button>
            )}
          </div>
        </div>
        <KakaoMapMultiplePins 
          displayedPins={displayedPins} 
          isLoading={isLoading}
        />
        <button
          onClick={() => setIsMapOpen(false)}
          className="w-full py-2 mt-6 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700"
        >
          닫기
        </button>
      </Modal>

      {/* ✅ 필터/검색 영역은 항상 보여야 하므로 분리 */}
      <UserInfo />
    </aside>
  );
}
