import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminUserList from "../components/admin/AdminUserList";
import AdminAccOrderList from "../components/admin/AdminAccOrderList";
import AdminThemeOrderList from "../components/admin/AdminThemeOrderList";
import AdminAccReviewList from "../components/admin/AdminAccReviewList";
import AdminThemeReviewList from "../components/admin/AdminThemeReviewList";
import AccommodationReview from "../components/review/AccommodationReview";
import AdminCouponList from "../components/admin/AdminCouponList";
import ThemeReview from "../components/review/ThemeReview";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMembers } from "../services/authApi.js";

export default function Admin() {
  const navigate = useNavigate(); // ✅ 선언
  const dispatch = useDispatch();
  const members = useSelector((state) => state.login?.allMembers || []);
  const [accommodationReviews, setAccommodationReviews] = useState([]);
  const [themeReviews, setThemeReviews] = useState([]);
  const [accommodationOrders, setAccommodationOrders] = useState([]);
  const [themeOrders, setThemeOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [findMenu, setFindMenu] = useState("user");

  // 일반, sns 회원 리스트 불러오기
  useEffect(() => {
    dispatch(fetchAllMembers());
  }, [dispatch]);

  // ✅ 숙박 예약 데이터 불러오기
  const fetchAccommodationOrders = async () => {
    try {
      const response = await axios.get("http://localhost:9000/accorder/list");
      setAccommodationOrders(response.data);
    } catch (error) {
      console.error("숙박 예약 데이터 불러오기 실패:", error);
    }
  };

  // ✅ 공연 예매 데이터 불러오기
  const fetchPerformanceOrders = async () => {
    try {
      const response = await axios.get("http://localhost:9000/order/performance/list");
      setThemeOrders(response.data);
    } catch (error) {
      console.error("공연 예매 데이터 불러오기 실패:", error);
    }
  };

  // ✅ Firestore에서 쿠폰 정보 가져오기
  const fetchCoupons = async () => {
    try {
      const response = await axios.get("http://localhost:9000/coupons/get");
      setCoupons(response.data);
    } catch (error) {
      console.error("❌ 쿠폰 목록 불러오기 실패:", error);
    }
  };

  // ✅ Firestore에서 쿠폰 삭제
  const deleteCoupon = async (coupon) => {
    alert(`${coupon.id}님의 ${coupon.grade} 쿠폰을 삭제하시겠습니까?`);
    try {
      await axios.delete(`http://localhost:9000/coupons/delete/${coupon.id}`);
      alert("✅ 쿠폰이 성공적으로 삭제되었습니다.");
      fetchCoupons();
    } catch (err) {
      console.error("❌ 쿠폰 삭제 실패:", err);
      alert("쿠폰 삭제에 실패했습니다.");
    }
  };


  function formatKoreanFullTimestamp(createdAt) {
    if (!createdAt?._seconds) return "날짜 없음";
  
    const date = new Date(createdAt._seconds * 1000);
  
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Seoul",
      // timeZoneName: "short" // UTC+9 포함
    });
  }
  
  // ✅ Firestore에 저장된 숙박 리뷰 가져오기
  const fetchAccReviewsFromFirebase = async () => {
    try {
      const response = await axios.get("http://localhost:9000/accReview/accReviewList");
      const firebaseReviews = response.data;
      console.log("asdf", firebaseReviews);
      const formatted = firebaseReviews.map((r) => ({
        id: r.id, // Firebase 문서 ID
        accommodation_id: r.accommodationId,
        user_id: r.userId,
        date: formatKoreanFullTimestamp(r.createdAt),
        star: r.rating,
        comment: r.reviewContent,
        images: r.imageUrls || []
      }));
      
      setAccommodationReviews(formatted);
    } catch (error) {
      console.error("❌ Firebase 리뷰 불러오기 실패:", error.response?.data || error.message);
    }
  };
  // ✅ Firestore에 저장된 테마 리뷰 가져오기
  const fetchThemeReviewsFromFirebase = async () => {
    try {
      const response = await axios.get("http://localhost:9000/themeReview/themeReviewList");
      const firebaseReviews = response.data;
      console.log("asdf", firebaseReviews);
      const formatted = firebaseReviews.map((r) => ({
        id: r.id, // Firebase 문서 ID
        performance_id: r.performanceId,
        user_id: r.userId,
        date: formatKoreanFullTimestamp(r.createdAt),
        star: r.rating,
        comment: r.reviewContent,
        images: r.imageUrls || []
      }));
      
      setThemeReviews(formatted);
    } catch (error) {
      console.error("❌ Firebase 리뷰 불러오기 실패:", error.response?.data || error.message);
    }
  };

  // ✅ 메뉴 클릭 시 데이터 불러오기
  const handleMenuList = (type) => {
    setFindMenu(type);
    if (type === "user") {
      dispatch(fetchAllMembers());
    } else if (type === "accOrder") {
      fetchAccommodationOrders();
    } else if (type === "themeOrder") {
      fetchPerformanceOrders();
    } else if (type === "accReview") {
      fetchAccReviewsFromFirebase();
    } else if (type === "themeReview") {
      fetchThemeReviewsFromFirebase();
    } else if (type === "coupon") {
      fetchCoupons();
    }
  };


  // ✅ 테마 리뷰 삭제
  const deleteThemeReview = async (reviewId) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      const response = await axios.delete(`http://localhost:9000/themeReview/theme/delete/${reviewId}`);
      if (response.data.success) {
        alert('리뷰가 삭제되었습니다.');
        // 리뷰 목록 새로고침
        fetchThemeReviewsFromFirebase();
      } else {
        throw new Error(response.data.message || '리뷰 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert(error.message || '리뷰 삭제에 실패했습니다.');
    }
  };

  // ✅ 숙박 리뷰 삭제
  const deleteAccReview = async (reviewId) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      const response = await axios.delete(`http://localhost:9000/accReview/accommodation/delete/${reviewId}`);
      if (response.data.success) {
        alert('리뷰가 삭제되었습니다.');
        // 리뷰 목록 새로고침
        fetchAccReviewsFromFirebase();
      } else {
        throw new Error(response.data.message || '리뷰 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert(error.message || '리뷰 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="pt-[80px]">
      {/* ✅ 상단 헤더 */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <img src="/images/logo/logo1.png" alt="logo" className="object-contain w-20 h-20" />
          <span className="text-3xl">관리자 페이지</span>
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            alert("로그아웃 되었습니다.");
            navigate("/admin"); // ✅ 이동
          }}
          className="px-4 py-2 text-white transition bg-red-500 rounded hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>

      {/* ✅ 본문 콘텐츠 */}
      <div className="p-6 pt-[100px]">
        <ul className="flex gap-5 mb-4 cursor-pointer">
          <li onClick={() => handleMenuList("user")}>회원 리스트</li>
          <li onClick={() => handleMenuList("accOrder")}>숙박 주문 리스트</li>
          <li onClick={() => handleMenuList("themeOrder")}>테마 주문 리스트</li>
          <li onClick={() => handleMenuList("accReview")}>숙박 리뷰 리스트</li>
          <li onClick={() => handleMenuList("themeReview")}>테마 리뷰 리스트</li>
          <li onClick={() => handleMenuList("coupon")}>쿠폰 발급 리스트</li>
        </ul>

        <AdminUserList findMenu={findMenu} members={members} />
        <AdminAccOrderList findMenu={findMenu} accommodationOrders={accommodationOrders} />
        <AdminThemeOrderList findMenu={findMenu} themeOrders={themeOrders} />
        <AdminAccReviewList 
          findMenu={findMenu} 
          accommodationReviews={accommodationReviews} 
          onDeleteReview={deleteAccReview}
        />
        <AdminThemeReviewList 
          findMenu={findMenu} 
          themeReviews={themeReviews} 
          onDeleteReview={deleteThemeReview}
        />
        <AdminCouponList findMenu={findMenu} coupons={coupons} deleteCoupon={deleteCoupon} />
      </div>
    </div>
  );

}
