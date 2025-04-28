import React, { useState, useEffect } from "react";
import CancleBtn from "../../components/mypage/CancleBtn.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

/**
 * 별점 표시 및 선택을 위한 컴포넌트
 *  rating - 현재 별점 값
 *  onRatingChange - 별점 변경 시 호출될 콜백 함수
 */
const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex items-center my-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating} / 5)</span>
    </div>
  );
};

/**
 * 테마/공연 예약 내역을 표시하고 리뷰를 작성하는 메인 컴포넌트
 */
export default function ReservationTheme() {
  const [themeReservations, setThemeReservations] = useState([]);
  const [openReviewId, setOpenReviewId] = useState(null);
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewImages, setReviewImages] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [oldFiles, setOldFiles] = useState([]);
  const [sendReview, setSendReview] = useState(() => {
    const savedReviews = localStorage.getItem("themeReviews");
    return savedReviews ? JSON.parse(savedReviews) : [];
  });

  // sendReview가 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    localStorage.setItem("themeReviews", JSON.stringify(sendReview));
  }, [sendReview]);

  // 로그인한 유저 정보 가져오기
  const userId = localStorage.getItem("user_id");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isSnsUser = user.provider ? true : false;
  const userIdentifier = isSnsUser ? user.sns_id : userId;

  /**
   * 컴포넌트 마운트 시 또는 userId 변경 시 공연 예약 데이터를 가져오는 Hook
   */
  useEffect(() => {
    const fetchPerformanceOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:9000/order/performance/list"
        );
        // SNS 로그인 사용자의 경우 sns_id로 필터링
        const userOrders = response.data.filter(
          (order) => order.sns_id === userIdentifier || order.user_id === userIdentifier
        );
        setThemeReservations(userOrders);
      } catch (error) {
        console.error("공연 예매 데이터 불러오기 실패:", error);
        setError("공연 예매 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userIdentifier) {
      fetchPerformanceOrders();
    }
  }, [userIdentifier]);

  /**
   * 특정 예약 항목의 리뷰 작성 영역을 열거나 닫는 함수
   */
  const handleReviewToggle = (id) => {
    setOpenReviewId((prevId) => (prevId === id ? null : id));
    setReviewContent("");
    setRating(0);
    setReviewImages(null);
    setImagePreviews([]);
  };

  /**
   * 파일 입력 변경 시 호출되어 이미지 상태 및 미리보기를 업데이트하는 함수
   */
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setReviewImages(files);
      const newPreviews = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === files.length) {
            setImagePreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setReviewImages(null);
      setImagePreviews([]);
    }
  };

  /**
   * 리뷰 데이터와 이미지를 FormData에 담아 서버로 제출하는 함수
   */
  const handleSubmitReview = async (id) => {
    const item = themeReservations.find(
      (reservation) => reservation.order_id === id
    );

    const formData = new FormData();
    formData.append("review_id", item.performance_id);
    formData.append("rating", rating);
    formData.append("reviewContent", reviewContent);
    formData.append("oldFile", oldFiles.join(","));

    if (reviewImages && reviewImages.length > 0) {
      for (const file of reviewImages) {
        formData.append("files", file);
      }
    }

    try {
      const uploadResponse = await axios.post(
        `http://localhost:9000/uploads/?maxFiles=${
          reviewImages ? reviewImages.length : 0
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (uploadResponse.data && uploadResponse.data.oldFile) {
        setOldFiles(uploadResponse.data.oldFile);
      }

      const reviewData = {
        type: "theme",
        orderId: id,
        rating,
        reviewContent,
        imageUrls: uploadResponse.data.uploadFileName || [],
      };

      const reviewResponse = await axios.post(
        "http://localhost:9000/themeReview/theme",
        reviewData
      );

      handleReviewToggle(id);
      setOpenReviewId(null);

      // 리뷰 작성 성공 처리
      setSendReview((prev) => [...prev, id]);
      toast.success("리뷰 작성이 완료되었습니다.");
    } catch (error) {
      console.error(
        "❌ 리뷰 제출 실패:",
        error.response?.data || error.message
      );
      toast.error("리뷰 작성에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl py-4 mx-auto space-y-6 md:py-8">
        <h2 className="text-2xl font-bold md:text-3xl">테마/공연 예약 내역</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="overflow-hidden transition duration-300 bg-white border shadow-sm rounded-2xl"
            >
              <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
                <div className="relative flex-shrink-0 w-full h-64 overflow-hidden rounded-lg md:w-40 md:h-56">
                  <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                </div>

                <div className="flex flex-col flex-grow md:flex-row md:gap-6">
                  <div className="flex-grow space-y-3">
                    <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between pt-4 mt-4 border-t md:border-t-0 md:pt-0 md:mt-0 md:flex-col md:items-end md:justify-between md:flex-shrink-0 md:w-32">
                    <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex gap-2 md:flex-col md:items-end">
                      <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (themeReservations.length === 0) {
    return (
      <div className="text-center text-gray-500">예약 내역이 없습니다.</div>
    );
  }

  return (
    <div className="max-w-6xl py-4 mx-auto space-y-6 md:py-8">
      <h2 className="text-2xl font-bold md:text-3xl">테마/공연 예약 내역</h2>

      <div>
        <div className="space-y-4">
          {themeReservations.map((item) => (
            <div
              key={item.order_id}
              className="overflow-hidden transition duration-300 bg-white border shadow-sm rounded-2xl hover:shadow-md"
            >
              <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
                <div className="relative flex-shrink-0 w-full h-64 overflow-hidden rounded-lg md:w-40 md:h-56">
                  <img
                    src={
                      item.image_url ||
                      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF263604_250422_105422.jpg"
                    }
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4 md:hidden">
                    <span className="px-3 py-1 text-sm font-medium text-green-600 bg-white rounded-full">
                      {item.order_status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow md:flex-row md:gap-6">
                  <div className="flex-grow space-y-1">
                    <div className="flex items-start justify-between md:items-center">
                      <div>
                        <span className="hidden px-3 py-1 mb-1 text-sm font-medium text-green-600 rounded-full md:inline-block bg-green-50">
                          {item.order_status}
                        </span>
                        <h3 className="text-xl font-bold leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1">
                      <p className="text-sm text-gray-600">{item.venue}</p>
                      <p className="text-sm text-gray-600">
                        {item.venue_address}
                      </p>
                    </div>

                    <div className="pt-2 space-y-1">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          공연일
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          좌석 정보
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.seats
                            .map(
                              (seat) => `${seat.seat_id} (${seat.seat_grade})`
                            )
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between pt-4 mt-4 border-t md:border-t-0 md:pt-0 md:mt-0 md:flex-col md:items-end md:justify-between md:flex-shrink-0 md:w-32">
                    <p className="text-lg font-bold">
                      ₩{item.total_price.toLocaleString()}
                    </p>
                    <div className="flex gap-2 md:flex-col md:items-end">
                      <button
                        onClick={() => handleReviewToggle(item.order_id)}
                        disabled={sendReview.includes(item.order_id)}
                        className={`px-3 py-1 mt-1 text-sm border rounded-full whitespace-nowrap ${
                          sendReview.includes(item.order_id)
                            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                            : "text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                        }`}
                      >
                        {sendReview.includes(item.order_id)
                          ? "리뷰 작성 완료"
                          : "리뷰쓰기"}
                      </button>
                      {!sendReview.includes(item.order_id) && (
                        <CancleBtn
                          text="예약 취소"
                          orderId={item.order_id}
                          type="theme"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`
                transition-all duration-300 ease-in-out overflow-hidden
                ${
                  openReviewId === item.order_id
                    ? "max-h-96 opacity-100 p-4 pt-0 md:px-6 md:pb-6"
                    : "max-h-0 opacity-0 p-0"
                }
              `}
              >
                <div className="pt-4 border-t">
                  <h4 className="mb-2 font-semibold">리뷰 작성</h4>
                  <StarRating
                    rating={openReviewId === item.order_id ? rating : 0}
                    onRatingChange={setRating}
                  />
                  <textarea
                    className="w-full p-2 text-sm border rounded"
                    rows="3"
                    placeholder="관람 경험에 대한 리뷰를 작성해주세요."
                    value={openReviewId === item.order_id ? reviewContent : ""}
                    onChange={(e) => setReviewContent(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => handleReviewToggle(item.order_id)}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-100 border rounded hover:bg-gray-200"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSubmitReview(item.order_id)}
                      disabled={!reviewContent.trim() || rating === 0}
                      className="px-3 py-1 text-sm text-white bg-indigo-500 rounded hover:bg-indigo-600 disabled:bg-gray-300"
                    >
                      등록
                    </button>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`images-${item.order_id}`}
                      className="block text-sm font-medium text-gray-500"
                    >
                      이미지 첨부
                    </label>
                    <input
                      id={`images-${item.order_id}`}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      multiple
                    />
                    {imagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="object-cover w-24 h-24 rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
