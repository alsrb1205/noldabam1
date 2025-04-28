// BookingModal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PerReviewList from "./PerReviewList";
import { useOrder } from "../../context/OrderContext";
export default function BookingModal({ title, onClose, guides = [], warnings = [], image, category, period, area, genrenm, mt20id, fcltynm }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [venueAddress, setVenueAddress] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const {performanceOrders, setPerformanceOrders}= useOrder();
  // 공연장 주소 가져오기
  useEffect(() => {
    const fetchVenueAddress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!mt20id) {
          throw new Error("공연 ID가 없습니다.");
        }

        // 1. 공연 상세 정보 조회
        const performanceResponse = await axios.get(`http://localhost:9000/kopis/detail/${mt20id}`);
        
        if (!performanceResponse.data || !performanceResponse.data.mt10id) {
          throw new Error("공연 상세 정보를 찾을 수 없습니다.");
        }
        
        const mt10id = performanceResponse.data.mt10id;

        // 2. 공연장 상세 정보 조회
        const venueResponse = await axios.get(`http://localhost:9000/kopis/venue/${mt10id}`);
        
        if (!venueResponse.data || !venueResponse.data.adres) {
          throw new Error("공연장 주소 정보를 찾을 수 없습니다.");
        }
        
        setVenueAddress(venueResponse.data.adres);
      } catch (error) {
        console.error("[BookingModal] 시설 정보를 가져오는데 실패했습니다:", error);
        setError(error.response?.data?.error || error.message || "시설 정보를 가져오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (mt20id) {
      fetchVenueAddress();
    } else {
      setIsLoading(false);
    }
  }, [mt20id]);

  // 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/themeReview/theme/performance/${mt20id}`);
        
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
        console.error("❌ 에러 응답:", error.response?.data);
        console.error("❌ 에러 상태:", error.response?.status);
        setReviews([]); // 에러 발생 시 빈 배열로 설정
      } finally {
        setIsReviewsLoading(false);
      }
    };

    if (mt20id) {
      fetchReviews();
    } else {
      setReviews([]);
      setIsReviewsLoading(false);
    }
  }, [mt20id]);

const handleBooking = () => {
  const bookingData = {
    mt20id,
    title,
    guides,
    warnings,
    image,
    category,
    period,
    area,
    genrenm,
    fcltynm,
    venueAddress,
  };

  // 🔥 1. performanceOrders에 추가
  setPerformanceOrders(bookingData);

  // 🔥 2. 페이지 이동
  navigate("/performancereservation", { 
    state: bookingData
  });
};

  return (
    <div className="relative">
      {/* 공연 제목 */}
      <h2 className="mb-6 text-2xl font-bold text-center">{title}</h2>

      {/* 탭 메뉴 */}
      <div className="flex justify-end mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'info'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('info')}
        >
          공연 정보
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

      <div className="space-y-6 text-sm text-gray-800 max-h-[400px] overflow-y-auto px-1">
        {/* 공연 정보 탭 */}
        {activeTab === 'info' && (
          <>
            {/* 🎭 공연 상세정보 */}
            <div>
              <h3 className="pb-1 mb-2 text-lg font-semibold border-b">🎭 공연 상세정보</h3>
              {isLoading ? (
                <div className="py-4 text-center">
                  <p className="text-gray-600">정보를 불러오는 중입니다...</p>
                </div>
              ) : error ? (
                <div className="py-4 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="mb-1 leading-relaxed">• 공연시설명 : {fcltynm}</p>
                  <p className="mb-1 leading-relaxed">• 주소 : {venueAddress}</p>
                  <p className="mb-1 leading-relaxed">• 장르 : {genrenm}</p>
                </div>
              )}
            </div>

            {/* ⚠ 유의사항 */}
            <div>
              <h3 className="pb-1 mb-2 text-lg font-semibold border-b">⚠ 유의사항</h3>
              {warnings.length > 0 ? (
                warnings.map((note, idx) => (
                  <p key={idx} className="mb-1 leading-relaxed">• {note}</p>
                ))
              ) : (
                <p className="text-gray-500">별도의 유의사항이 없습니다.</p>
              )}
            </div>
          </>
        )}

        {/* 리뷰 탭 */}
        {activeTab === 'reviews' && (
          isReviewsLoading ? (
            <div className="py-4 text-center">리뷰를 불러오는 중...</div>
          ) : (
            <PerReviewList reviews={reviews} />
          )
        )}
      </div>

      {/* 예매하기 버튼 */}
      <button
        onClick={handleBooking}
        className="w-full py-2 mt-6 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "로딩 중..." : "예매하기"}
      </button>
    </div>
  );
}
