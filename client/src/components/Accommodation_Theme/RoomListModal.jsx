import { useSelector } from "react-redux";
import { useOrder } from "../../context/OrderContext.jsx";
import { accommodataionDetails } from "../../accommodationDetailData.js";
import KakaoApiMap from "../kakaoMap/KakaoApiMap.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { cat3ToType } from "../../filtersData.js";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import getTodayDate from "../../utils/getTodayDate.js";
import AccReviewList from "./AccReviewList.jsx";

export default function RoomListModal({ accommodation, onClose}) {
  const firstDate = useSelector((state) => state.userInfo.firstDate);
  const lastDate = useSelector((state) => state.userInfo.lastDate);
  const userCount = useSelector((state) => state.userInfo.userCount);
  // const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const [detailInfo, setDetailInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { roomOrder, setRoomOrder } = useOrder();
  const navigate = useNavigate();
  const [expandedOptions, setExpandedOptions] = useState({});
  const [today, tomorrow] = getTodayDate();
  const [activeTab, setActiveTab] = useState('info');
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);

  // fallback용 데이터 (detailInfo가 없을 경우 사용)
  const typeName = cat3ToType[accommodation.cat3];
  const fallbackRooms = (accommodataionDetails[typeName]?.rooms || [])
    .filter(room => parseInt(room.maxPeople) >= userCount);

  // API로부터 받아온 방 정보를 파싱하여 표준화된 형식으로 변환
  // - detailInfo가 배열이고 roomtitle이 있는 경우에만 API 데이터 파싱
  // - 그 외의 경우는 빈 배열 반환
  const parsedRooms = Array.isArray(detailInfo) && detailInfo.length > 0 && detailInfo[0].roomtitle
    ? detailInfo.map((room, i) => ({
      name: room.roomtitle,
      checkIn: "15:00",
      checkOut: "11:00",
      maxPeople: room.roommaxcount || "2",
      options: [
        room.roomaircondition === "Y" && "에어컨",
        room.roomtv === "Y" && "TV",
        room.roominternet === "Y" && "인터넷",
        room.roomrefrigerator === "Y" && "냉장고",
        room.roomtoiletries === "Y" && "세면도구",
        room.roomtable === "Y" && "테이블",
        room.roomsofa === "Y" && "소파",
        room.roomhairdryer === "Y" && "드라이기",
        room.roombath === "Y" && "욕조",
        room.roombathfacility === "Y" && "욕실시설"
      ].filter(Boolean),
      price: room.roomoffseasonminfee1 && parseInt(room.roomoffseasonminfee1) > 0
        ? parseInt(room.roomoffseasonminfee1)
        : 100000 + i * 20000,
      image: room.roomimg1 || ""
    }))
      .filter(room => parseInt(room.maxPeople) >= userCount)
    : [];

  // 최종 출력할 리스트 결정
  // API 데이터가 있고 인원수 조건을 만족하는 방이 있을 때만 API 데이터 사용
  // API 데이터가 없을 때만 fallback 데이터 사용
  const finalRooms = parsedRooms.length > 0
    ? parsedRooms
    : (Array.isArray(detailInfo) && detailInfo.length > 0 ? [] : fallbackRooms);

  useEffect(() => {
    const fetchDetailInfo = async () => {
      // API 호출 시작 시 로딩 상태 활성화
      setIsLoading(true);
      try {
        const { data } = await axios.get("https://apis.data.go.kr/B551011/KorService1/detailInfo1", {
          params: {
            serviceKey: decodeURIComponent("C2%2BCvn1jcs6wPY5EXyqceu3WXDRT6iw%2FMiF1tmdof4869K0FRiH58%2FLPkqMRyZm2l4Gb%2FsJqE8CoeMLYQ2vgNg%3D%3D"),
            MobileApp: "AppTest",
            MobileOS: "ETC",
            contentId: accommodation.contentid,
            contentTypeId: 32,
            _type: "json",
          }
        });

        const items = data?.response?.body?.items?.item;
        // API 응답이 빈 데이터인지 확인 (모든 필드가 빈 문자열인 경우)
        const isEmptyResponse = items && items.length > 0 && items[0].roomtitle === "";

        if (items && !isEmptyResponse) {
          setDetailInfo(items);
        } else {
          setDetailInfo([]);
        }
      } catch (error) {
        console.error("❌ detailInfo1 호출 실패:", error);
        setDetailInfo([]);
      } finally {
        // API 호출이 성공하든 실패하든 로딩 상태 비활성화
        setIsLoading(false);
      }
    };

    if (accommodation.contentid) {
      fetchDetailInfo();
    }
  }, [accommodation.contentid]);

  // 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/accReview/accommodation/${accommodation.contentid}`);
        
        const formattedReviews = response.data.map(review => ({
          id: review.id,
          author: review.userId,
          rating: review.rating,
          date: new Date(review.createdAt._seconds * 1000).toLocaleDateString('ko-KR'),
          content: review.reviewContent,
          images: review.imageUrls || []
        }));
        
        setReviews(formattedReviews);
      } catch (error) {
        console.error("❌ 리뷰 불러오기 실패:", error);
      } finally {
        setIsReviewsLoading(false);
      }
    };

    if (accommodation.contentid) {
      fetchReviews();
    }
  }, [accommodation.contentid]);

  useEffect(() => {
    // 모달이 열릴 때 배경 스크롤 막기
    document.body.style.overflow = 'hidden';
    return () => {
      // 모달이 닫힐 때 스크롤 복원
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleReservation = (room) => {
    const formData = {
      accommodationId: accommodation.contentid,
      accommodationName: accommodation.title,
      roomName: room.name,
      checkIn: new Date(firstDate).toLocaleDateString('en-CA'),
      checkOut: new Date(lastDate).toLocaleDateString('en-CA'),
      userCount: userCount,
      price: room.price,
      maxPeople: room.maxPeople,
      address: accommodation.location,
      type: cat3ToType[accommodation.cat3],
      image: accommodation.image || "https://ak-d.tripcdn.com/images/220a15000000xefhnB3B7_W_400_400_R5.webp?default=1"
    };
    
    setRoomOrder(formData);
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
    navigate("/reservation");
  };

  const toggleOptions = (roomName) => {
    setExpandedOptions(prev => ({
      ...prev,
      [roomName]: !prev[roomName]
    }));
  };

  return (
    <div className="w-full mx-auto">
      {/* 상단 예약 정보 */}
      <div className="flex flex-row justify-between space-y-4 md:items-top md:space-y-0">
        <h2 className="text-[24px] font-bold text-gray-800">{accommodation.title}</h2>

        <div className="w-auto p-4 text-gray-800 rounded-lg shadow-sm bg-blue-50">
          <p className="mt-1 text-[12px]">
            🗓 <span className="font-medium">
              {firstDate && new Date(firstDate).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
            </span> ~{" "}
            <span className="font-medium">
              {lastDate && new Date(lastDate).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
            </span>
          </p>
          <p className="mt-1 text-[12px]">👤 인원수: {userCount}명</p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-start mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'info'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('info')}
        >
          숙소 정보
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'reviews'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          리뷰 {`(${reviews.length})`}
        </button>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
        {/* 숙소 정보 탭 */}
        {activeTab === 'info' && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {finalRooms.map((room, i) => (
                  <div key={i} className="flex flex-col p-6 border shadow-md md:flex-row rounded-2xl bg-gray-50">
                    <img
                      src={room.image ? room.image : "/images/acc/room.jpg"}
                      alt={room.name}
                      className="object-cover w-full mb-4 h-[200px] rounded-xl md:w-[250px] md:h-[150px] md:mb-0"
                    />

                    <div className="flex flex-col justify-between w-full md:ml-6">
                      <div className="">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[20px] font-semibold text-gray-800">{room.name}</h3>
                        </div>

                        <div className="text-gray-700 text-[14px] mt-[10px]">
                          ⏰ 입실 <span className="font-semibold">{room.checkIn}</span> · 퇴실{" "}
                          <span className="font-semibold">{room.checkOut}</span>
                        </div>
                        <div className="text-[14px]">👥 최대 인원: {room.maxPeople}명</div>
                        <div className="mt-[10px]">
                          <button
                            onClick={() => toggleOptions(room.name)}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                          >
                            <span>옵션</span>
                            {expandedOptions[room.name] ? (
                              <FaChevronUp className="ml-1" />
                            ) : (
                              <FaChevronDown className="ml-1" />
                            )}
                          </button>

                          {expandedOptions[room.name] && (
                            <ul className="mt-2 ml-4 list-disc">
                              {room.options.map((opt, idx) => (
                                <li key={idx} className="text-sm text-gray-600">{opt}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row items-baseline justify-between ">
                        <div className="">
                          <p className="text-[20px] tracking-tighter font-extrabold">{room.price.toLocaleString()} 원</p>
                        </div>
                        <button
                          className="px-6 py-2 mt-4 text-base font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 md:mt-0"
                          onClick={() => handleReservation(room)}
                        >
                          객실 예약
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {finalRooms.length === 0 && (
                  <p className="text-center text-gray-500">해당 숙소의 객실 정보가 없습니다.</p>
                )}

                {/* 지도 표시 */}
                <KakaoApiMap address={accommodation.location} />
              </>
            )}
          </>
        )}

        {/* 리뷰 탭 */}
        {activeTab === 'reviews' && (
          isReviewsLoading ? (
            <div className="py-4 text-center">리뷰를 불러오는 중...</div>
          ) : (
            <AccReviewList reviews={reviews} />
          )
        )}
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="w-full py-2 mt-6 font-bold text-white bg-gray-600 rounded hover:bg-gray-700"
      >
        닫기
      </button>
    </div>
  );
}