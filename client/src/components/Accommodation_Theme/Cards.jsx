// ✅ Cards.jsx
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import useThemeData from "../../hooks/useThemeData.js";
import useAccommodationData from "../../hooks/useAccommodationData.js";
import BookingModal from './BookingModal.jsx';
import Modal from "react-modal";
import RoomListModal from "./RoomListModal.jsx";
import { kakaoMapPins } from "../../services/kakaoMapApi.js";
import { FiltersContext } from "../../context/FiltersContext.jsx";
import LoadingSpinner from "../common/LoadingSpinner";
import { cat3ToType } from "../../filtersData.js";
import { accommodataionDetails } from "../../accommodationDetailData.js";
import { Link } from "react-router-dom";
import { useReview } from '../../context/ReviewContext';
// import {accommodationTypeMap} from "../../filtersData.js";
import { useOrder } from "../../context/OrderContext.jsx";
export default function Cards() {
  const { filters, setFilters } = useContext(FiltersContext);
  const dispatch = useDispatch();
  const category = useSelector((state) => state.toggle.category);
  const { 
    order, 
    setOrder, 
    roomOrder, 
    setRoomOrder, 
    clearOrders, 
    performanceOrders, 
    addPerformanceOrder 
  } = useOrder();
  
  useEffect(() => {
    clearOrders();
    // 이전 주문 내역 삭제
  }, [])
  
  // 카테고리에 따라 적절한 타입 선택
  const isAccommodation = category === "accommodation";
  const type = useSelector((state) =>
    isAccommodation
      ? state.userInfo.accommodationType
      : state.userInfo.themeType
  ) || "전체";

  const location = useSelector((state) => state.userInfo.location);
  const subLocation = useSelector((state) => state.userInfo.subLocation);
  const firstDate = useSelector((state) => state.userInfo.firstDate);
  const lastDate = useSelector((state) => state.userInfo.lastDate);
  const keyword = useSelector((state) => state.userInfo.keyword);
  const userCount = useSelector((state) => state.userInfo.userCount);


  const { list, loading, hasMore } = useSelector(state => state.accommodation); // 무한스크롤을 위한 구조 (대기)
  const defaultType = type || "전체";
  const { accommodationList, loading: accommodationLoading } = useAccommodationData(location, subLocation, defaultType, keyword);
  const { themeList, loading: themeLoading } = useThemeData({
    category: useSelector((state) => state.toggle.category),
    type: useSelector((state) => state.userInfo.themeType),
    location: useSelector((state) => state.userInfo.location),
    firstDate: useSelector((state) => state.userInfo.firstDate),
    lastDate: useSelector((state) => state.userInfo.lastDate),
    keyword: useSelector((state) => state.userInfo.keyword),
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const isOpen = !!selectedCard;

  // 무한 스크롤 관련 상태
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const itemsPerPage = 20;
  const observer = useRef();
  const hasMoreItems = displayedItems.length < filters.length;

  const lastItemRef = useCallback(node => {
    // 모든 아이템이 로드되었거나 로딩 중이면 관찰 중지
    if (!hasMoreItems || isPageLoading) {
      if (observer.current) {
        observer.current.disconnect();
      }
      return;
    }

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreItems && !isPageLoading) {
        setIsPageLoading(true);
        // 1초 로딩 추가
        setTimeout(() => {
          setPage(prevPage => prevPage + 1);
          setIsPageLoading(false);
        }, 1000);
      }
    }, { threshold: 1.0 });

    if (node) observer.current.observe(node);
  }, [hasMoreItems, isPageLoading]);

  // 페이지가 변경될 때마다 표시할 아이템 업데이트
  useEffect(() => {
    if (filters && filters.length > 0) {
      const startIndex = 0;
      const endIndex = page * itemsPerPage;
      const newDisplayedItems = filters.slice(startIndex, endIndex);
      setDisplayedItems(newDisplayedItems);
    } else {
      setDisplayedItems([]);
      setPage(1);
    }
  }, [filters, page]);


  const isAllType = type === "전체"; // ✅ type이 "전체"일 때를 체크

  const isLoading = isAccommodation ? accommodationLoading : themeLoading;

  // 카테고리 변경 감지
  const prevCategory = useRef(category);

  useEffect(() => {
    // 카테고리가 변경되었을 때만 필터 초기화
    if (prevCategory.current !== category) {
      setFilters([]);
      setPage(1);
      setDisplayedItems([]);
      prevCategory.current = category;
    }

    // 데이터가 있을 때만 필터 설정
    if (isAccommodation && accommodationList && accommodationList.length > 0) {
      setFilters(accommodationList);
      const locations = accommodationList.map((item) => ({
        ...item,
        name: item.title,
        address: item.location || item.addr1,
      }));
      kakaoMapPins(dispatch, { locations });
    } else if (!isAccommodation && themeList && themeList.length > 0) {
      setFilters(themeList);
    } else {
      setFilters([]);
    }
  }, [category, isAccommodation, accommodationList, themeList, dispatch]);

  // 숙소 기본이미지 함수
  const getDefaultImage = (cat3) => {
    switch (cat3) {
      case 'B02010100':
        return '/images/acc/호텔.webp';
      case 'B02010700':
        return '/images/acc/펜션.webp';
      case 'B02010500':
        return '/images/acc/콘도.jpg';
      case 'B02011100':
        return '/images/acc/게하.jpg';
      case 'B02010900':
        return '/images/acc/모텔.jpg';
      case 'B02010600':
        return '/images/acc/유스호스텔.png';
      case 'B02011600':
        return '/images/acc/한옥.webp';
      case 'B02011300':
        return '/images/acc/레지던스.jpg';
      case 'B02011000':
        return '/images/acc/민박.jpg';
      case 'B02011200':
        return '/images/acc/홈스테이.jpg';
      default:
        return '/images/acc/호텔.webp';
    }
  }

  const { getReviewData, updateTrigger } = useReview();
  const [reviewsMap, setReviewsMap] = useState({});

  useEffect(() => {
    const loadReviews = async () => {
      if (category === "accommodation" && displayedItems) {
        const newReviewsMap = {};
        for (const item of displayedItems) {
          try {
            const data = await getReviewData(item.contentid);
            newReviewsMap[item.contentid] = data || {
              rating: 0,
              reviewCount: 0,
              reviews: []
            };
          } catch (error) {
            console.error(`리뷰 데이터 로드 실패: ${item.contentid}`, error);
            newReviewsMap[item.contentid] = {
              rating: 0,
              reviewCount: 0,
              reviews: []
            };
          }
        }
        setReviewsMap(newReviewsMap);
      }
    };
    loadReviews();
  }, [category, displayedItems, getReviewData, updateTrigger]);

  if (isLoading && page === 1) {
    return (
      <div className={`grid 
        ${category === "accommodation" ? "lg:grid-cols-2 2xl:grid-cols-2" : "lg:grid-cols-2 2xl:grid-cols-3 "}
        gap-4`}>
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="relative flex flex-row w-full p-4 overflow-hidden bg-white border shadow-md rounded-xl animate-pulse"
          >
            <div className={`flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 ${category === "accommodation"
              ? "max-w-[220px] 2xl:max-w-[300px] w-[40%] min-w-[140px] h-[160px] 2xl:h-[200px]"
              : "w-[100px] h-[150px] 2xl:w-[200px] 2xl:h-[300px]"
              }`}
            />
            <div className="flex flex-col justify-between w-full ml-4">
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="w-48 h-6 bg-gray-200 rounded" />
                <div className="w-32 h-4 bg-gray-200 rounded" />
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-4 bg-gray-200 rounded" />
                  <div className="w-20 h-4 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-24 h-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!filters || filters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <p className="text-2xl font-semibold text-gray-600">검색 결과가 없습니다.</p>
          <p className="mt-2 text-gray-500">다른 검색어로 다시 시도해보세요.</p>
        </div>
      </div>
    );
  }




  return (
    <>
      <div className={`grid 
      ${category === "accommodation" ? "lg:grid-cols-2 2xl:grid-cols-2" : "lg:grid-cols-2 2xl:grid-cols-3 "}
      
        gap-4`}>
        {displayedItems && displayedItems.length > 0 &&
          displayedItems.map((item, idx) => {
            const reviewData = category === "accommodation" ? getReviewData(item.contentid) : null;
            return (
              <div
                key={idx}
                ref={idx === displayedItems.length - 1 ? lastItemRef : null}
                className={`relative flex flex-row w-full p-4 overflow-hidden bg-white shadow-md cursor-pointer group rounded-xl hover:shadow-lg border`}
                onClick={() => setSelectedCard(item)}
              >
                <div className={`flex-shrink-0 overflow-hidden rounded-lg ${category === "accommodation"
                  ? "max-w-[220px] 2xl:max-w-[300px] w-[40%] min-w-[140px] h-[160px] 2xl:h-[200px]"
                  : "w-[100px] h-[150px] 2xl:w-[200px] 2xl:h-[300px]"
                  }`}>
                  <img
                    src={item.image && item.image.length > 0
                      ? item.image
                      : getDefaultImage(item.cat3)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = getDefaultImage(item.cat3);
                    }}
                    className="object-cover w-full h-full"
                  />
                </div>


                <div className={`flex flex-col justify-between ml-4 ${category !== "accommodation" ? "min-h-[150px] 2xl:min-h-[300px]" : ""}`}>
                  {category === "accommodation" ? (
                    <div>
                      <div className="mb-1 text-[clamp(0.8rem,1vw,0.9rem)] text-gray-500">{cat3ToType[item.cat3] || item.type}</div>
                      <h2 className="text-[clamp(1rem,1.5vw,1.1rem)] font-bold">{item.title}</h2>
                      <p className="mt-1 text-[clamp(0.8rem,1vw,0.9rem)] text-gray-500">{item.location}</p>
                      <div className="flex items-center mt-2">
                        <span className="bg-black text-white text-[clamp(0.8rem,1vw,0.9rem)] font-bold px-2 py-0.5 rounded mr-2">
                          ★ {(reviewsMap[item.contentid]?.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-[clamp(0.8rem,1vw,0.9rem)] text-gray-600">
                          리뷰 {reviewsMap[item.contentid]?.reviewCount || 0}개
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        {/* <div className="mb-1 text-[12px] xl:text-[16px] text-gray-500">{item.category}</div> */}
                        <h2 className="font-bold text-[clamp(1rem,1.5vw,1.1rem)]">{item.title}</h2>
                        <p className="mt-1 text-[clamp(0.8rem,1vw,0.9rem)] text-gray-600">
                          {item.guides && item.guides.length > 1 ? item.guides[1] : item.location || "위치 정보 없음"}
                        </p>
                        <p className="mt-1 text-[clamp(0.8rem,1vw,0.9rem)] text-gray-500">{item.period || "기간 정보 없음"}</p>
                      </div>
                      <div>
                        <div className="text-[clamp(0.8rem,1vw,1rem)] text-blue-500">#{item.tag || "태그 없음"}</div>
                      </div>
                    </>
                  )}
                </div>


                {category === "theme" && (
                  <div
                    className={`absolute top-0 right-0 z-10 h-full w-0 px-0 py-8 text-white bg-black bg-opacity-70 rounded-xl overflow-hidden transition-all duration-300 ease-in-out group-hover:w-full group-hover:px-6`}
                  >
                    <div className="flex flex-col items-end justify-between w-full h-full text-right transition-opacity opacity-0 group-hover:opacity-100">
                      <div className="space-y-2 text-sm leading-relaxed text-white">
                        <p><span className="font-semibold">⚠️ 안내 :</span> {item.warnings ? item.warnings.join(", ") : "안내사항 없음"}</p>
                      </div>
                      <button
                        className="px-4 py-2 mt-6 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCard(item);
                        }}
                      >
                        예약하기
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
      </div>

      {isPageLoading && displayedItems.length < filters.length && (
        <div className={`grid 
          ${category === "accommodation" ? "lg:grid-cols-2 2xl:grid-cols-2" : "lg:grid-cols-2 2xl:grid-cols-3 "}
          gap-4`}>
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="relative flex flex-row w-full p-4 overflow-hidden bg-white border shadow-md rounded-xl animate-pulse"
            >
              <div className={`flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 ${category === "accommodation"
                ? "max-w-[220px] 2xl:max-w-[300px] w-[40%] min-w-[140px] h-[160px] 2xl:h-[200px]"
                : "w-[100px] h-[150px] 2xl:w-[200px] 2xl:h-[300px]"
                }`}
              />
              <div className="flex flex-col justify-between w-full ml-4">
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                  <div className="w-48 h-6 bg-gray-200 rounded" />
                  <div className="w-32 h-4 bg-gray-200 rounded" />
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-24 h-8 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCard && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setSelectedCard(null)}
          contentLabel="객실 선택 모달"
          className={`${category === 'accommodation' ? 'w-[90vw]' : 'w-[90vw]'} max-w-[900px] p-8 bg-white rounded-xl shadow-xl mx-auto`}
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          {category === 'theme' ? (
            <BookingModal
              title={selectedCard.title}
              onClose={() => setSelectedCard(null)}
              guides={selectedCard.guides}
              warnings={selectedCard.warnings}
              image={selectedCard.image}
              category={selectedCard.category}
              period={selectedCard.period}
              area={selectedCard.area}
              genrenm={selectedCard.genrenm}
              fcltynm={selectedCard.fcltynm}
              mt20id={selectedCard.mt20id}
            />
          ) : (
            <RoomListModal
              accommodation={{
                ...selectedCard,
                image: selectedCard.image || getDefaultImage(selectedCard.cat3)
              }}
              onClose={() => setSelectedCard(null)}
            />
          )}
        </Modal>
      )}

    </>
  );
}