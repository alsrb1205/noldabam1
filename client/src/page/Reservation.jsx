import React, { useState, useEffect } from "react";
import { useOrder } from "../context/OrderContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useKakaoPayment } from "../hooks/useKakaoPayment";
import AccommodationReservationItem from "../components/reservation/AccommodationReservationItem.jsx";
import PerformanceReservationItem from "../components/reservation/PerformanceReservationItem.jsx";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Reservation() {
  const navigate = useNavigate();
  const { 
    order, 
    roomOrder, 
    clearOrders, 
  } = useOrder();

  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardPassword, setCardPassword] = useState('');

  useEffect(() => {
    // location.state가 없으면 새로고침 또는 잘못된 진입이니까 리다이렉트
    if (!location.state && !roomOrder) {
      alert("❗ 올바른 경로가 아닙니다.");
      navigate("/");
    }
  }, [location, roomOrder]);

  // 1. Reservation 정상 진입 시 shouldReset 무조건 초기화
  useEffect(() => {
    localStorage.removeItem('shouldReset');
  }, []);

// 새로고침 감지 (뒤로가기는 신경 안 씀)
useEffect(() => {
  const handleBeforeUnload = () => {
    localStorage.setItem('shouldReset', 'true');
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);

// 페이지 새로 부팅됐을 때만 shouldReset 체크
useEffect(() => {
  const shouldReset = localStorage.getItem('shouldReset');

  if (shouldReset === 'true') {
    alert("❗ 올바른 경로가 아닙니다.");
    localStorage.removeItem('reduxState'); // Redux 저장된 상태 삭제
    localStorage.removeItem('shouldReset'); // 플래그 삭제
    navigate("/"); // 메인("/")으로 이동

  }
}, []); // ✅ location 아님. 빈 배열 -> 새로 부팅될 때만 체크

  // 로그인한 유저 정보 가져오기
  const user = useSelector((state) => state.login.user);
  const userId = localStorage.getItem("user_id");


  const { handleKakaoPayment, loading: kakaoLoading, error: kakaoError, } = useKakaoPayment();

  const [coupons, setCoupons] = useState([]);

  let hasFetched = false; //쿠폰 중복 호출 방지
  useEffect(() => {
    if (hasFetched) return;
    hasFetched = true;
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/coupons/getId",
          {
            params: { userId },
          }
        );

        setCoupons((prev) => [...prev, ...response.data]);
      } catch (error) {
        console.error("❌ 쿠폰 목록 불러오기 실패:", error);
      }
    };
    fetchCoupons();
  }, []);


  useEffect(() => {
    const newReservations = [];

    // 숙박 예약 정보 처리
    if (roomOrder) {
      const formattedReservation = {
        title: "숙박 예약",
        accommodationId: roomOrder.accommodationId,
        name: roomOrder.accommodationName,
        address: roomOrder.address,
        checkIn: roomOrder.checkIn,
        checkOut: roomOrder.checkOut,
        roomName: roomOrder.roomName,
        userCount: `${roomOrder.userCount}명`,
        price: `₩${roomOrder.price.toLocaleString()}`,
        amount: roomOrder.price,
        type: roomOrder.type,
        isAccommodation: true,
        image: roomOrder.image || "/images/acc/room.jpg",
      };
      newReservations.push(formattedReservation);
    }

    // 공연 예약 정보 처리
    if (location.state?.type === "performance") {
      const { performance, date, seats, totalPrice } = location.state;
      const { guides, ...performanceWithoutGuides } = performance; // guides 제거
      const formattedPerformanceReservation = {
        performanceId: performanceWithoutGuides.mt20id,
        title: performanceWithoutGuides.title,
        date: date,
        venue: performanceWithoutGuides.fcltynm,
        venueAddress: performanceWithoutGuides.venueAddress,
        seats: seats,
        totalPrice: totalPrice,
        genre: performanceWithoutGuides.category,
        isAccommodation: false,
        image: performanceWithoutGuides.image,
      };
      newReservations.push(formattedPerformanceReservation);
    }

    setReservations(newReservations);
  }, [order, roomOrder, location.state]);

  const paymentMethods = [
    { value: "card", label: "신용/체크카드" },
    { value: "kakaopay", label: "카카오페이" },
  ];

  const total = reservations.reduce((acc, cur) => {
    if (cur.isAccommodation) {
      return acc + cur.amount;
    } else {
      return acc + cur.totalPrice;
    }
  }, 0);
  const selectedCouponData = coupons.find(coupon => coupon.name === selectedCoupon);
  const couponDiscount = selectedCouponData ? selectedCouponData.amount : 0;
  const finalTotal = total - couponDiscount;

  const isValidExpiryDate = (month, year) => {
    if (!month || !year) return false;
    if (month.length !== 2 || year.length !== 2) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expiryMonth = parseInt(month);
    const expiryYear = parseInt(year);
    
    if (expiryMonth < 1 || expiryMonth > 12) return false;
    
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
    
    return true;
  };

  const handlePayment = async () => {
    if (selectedPayment === "card") {
      if (!/^\d{16}$/.test(cardNumber)) {
        toast.error("올바른 카드 번호를 입력해주세요.");
        return;
      }
      if (!isValidExpiryDate(expiryMonth, expiryYear)) {
        toast.error("유효하지 않은 만료일입니다.");
        return;
      }
      if (!/^\d{3}$/.test(cvc)) {
        toast.error("올바른 CVC를 입력해주세요.");
        return;
      }
      if (!/^\d{2}$/.test(cardPassword)) {
        toast.error("올바른 비밀번호를 입력해주세요.");
        return;
      }
    }
    if(!userId){
      alert('로그인 후 이용 가능합니다');
      navigate('/');
    }
    try {
      setIsLoading(true);
      setError(null);

      const performanceReservation = reservations.find(r => !r.isAccommodation);
      const accommodationReservation = reservations.find(r => r.isAccommodation);

      // [1] 할인 적용하기
      let discountedPerformancePrice = performanceReservation ? performanceReservation.totalPrice : 0;
      let discountedAccommodationPrice = accommodationReservation ? parseInt(accommodationReservation.price.replace(/[^0-9]/g, '')) : 0;

      const totalBeforeDiscount = discountedPerformancePrice + discountedAccommodationPrice;

      if (totalBeforeDiscount > 0 && couponDiscount > 0) {
        const discountRatio = couponDiscount / totalBeforeDiscount;

        if (performanceReservation) {
          discountedPerformancePrice = Math.round(discountedPerformancePrice - (discountedPerformancePrice * discountRatio));
        }
        if (accommodationReservation) {
          discountedAccommodationPrice = Math.round(discountedAccommodationPrice - (discountedAccommodationPrice * discountRatio));
        }
        
        // 쿠폰을 사용한 경우 플래그 설정
        localStorage.setItem('used_coupon', 'true');
      }

      // [2] 카카오페이 결제
      if (selectedPayment === 'kakaopay') {
        let orderDataList = [];

        if (performanceReservation) {
          orderDataList.push({
            user_id: userId,
            performance_id: performanceReservation.performanceId,
            title: performanceReservation.title,
            date: performanceReservation.date,
            venue: performanceReservation.venue,
            venue_address: performanceReservation.venueAddress,
            genre: performanceReservation.genre || '기타',
            total_price: discountedPerformancePrice,
            payment_method: 'kakaopay',
            image_url: performanceReservation.image,
            seats: performanceReservation.seats.map(seat => ({
              seat_id: seat.id || seat.seat_id,
              seat_grade: seat.grade || seat.seat_grade || '일반',
              seat_price: seat.price || seat.seat_price || discountedPerformancePrice / performanceReservation.seats.length
            }))
          });
        }

        if (accommodationReservation) {
          orderDataList.push({
            user_id: userId,
            accommodation_id: accommodationReservation.accommodationId,
            accommodation_name: accommodationReservation.name,
            room_name: accommodationReservation.roomName,
            check_in: accommodationReservation.checkIn,
            check_out: accommodationReservation.checkOut,
            user_count: accommodationReservation.userCount.replace('명', ''),
            price: discountedAccommodationPrice,
            address: accommodationReservation.address,
            type: accommodationReservation.type,
            payment_method: 'kakaopay',
            image: accommodationReservation.image
          });
        }
        
        await handleKakaoPayment(orderDataList, { id: userId });
        return;
      }

      // [3] 카드/네이버페이 등 일반 결제
      if (performanceReservation) {
        const response = await axios.post("http://localhost:9000/order/performance/create", {
          user_id: userId,
          performance_id: performanceReservation.performanceId,
          title: performanceReservation.title,
          date: performanceReservation.date,
          venue: performanceReservation.venue,
          venue_address: performanceReservation.venueAddress,
          genre: performanceReservation.genre || '기타',
          total_price: discountedPerformancePrice,
          payment_method: selectedPayment,
          image_url: performanceReservation.image,
          seats: performanceReservation.seats.map(seat => ({
            seat_id: seat.id || seat.seat_id,
            seat_grade: seat.grade || seat.seat_grade || '일반',
            seat_price: seat.price || seat.seat_price || discountedPerformancePrice / performanceReservation.seats.length
          }))
        });

        if (response.data.success) {
          window.location.href = `/payment/complete?payment_method=${selectedPayment}&user_id=${userId}`;
          return;
        }
      }

      if (accommodationReservation) {
        const response = await axios.post("http://localhost:9000/accorder/create", {
          user_id: userId,
          accommodation_id: accommodationReservation.accommodationId,
          accommodation_name: accommodationReservation.name,
          room_name: accommodationReservation.roomName,
          check_in: accommodationReservation.checkIn,
          check_out: accommodationReservation.checkOut,
          user_count: accommodationReservation.userCount.replace('명', ''),
          price: discountedAccommodationPrice,
          address: accommodationReservation.address,
          type: accommodationReservation.type,
          payment_method: selectedPayment,
          image: accommodationReservation.image
        });

        if (response.data.success) {
          window.location.href = `/payment/complete?payment_method=${selectedPayment}&user_id=${userId}&category=accommodation`;
          return;
        }
      }

      alert("결제가 완료되었습니다.");
      
      clearOrders();
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      setError("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <img
        className="w-full h-[300px] object-cover"
        src="/images/banner/banner3.jpg" alt="" />
      <div className="max-w-6xl p-6 mx-auto space-y-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Main Content */}
          <div className="relative space-y-4 md:col-span-2">
            <h1 className="mb-4 font-bold text-4xl absolute top-[-100px] left-[10px] text-white">
              예약 내역 확인
            </h1>
            {reservations.length > 0 ? (
              reservations.map((res, index) =>
                res.isAccommodation ? (
                  <AccommodationReservationItem key={index} res={res} />
                ) : (
                  <PerformanceReservationItem key={index} res={res} />
                )
              )
            ) : (
              <div className="p-6 !mt-0 text-center text-gray-500 bg-white border rounded-2xl">
                예약 내역이 없습니다.
              </div>
            )}
            {/* 쿠폰 및 결합 할인 */}
            <div className="p-6 space-y-4 bg-white border shadow-sm rounded-2xl">
              <h3 className="text-lg font-semibold">쿠폰 및 할인</h3>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">보유 쿠폰</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedCoupon}
                  onChange={(e) => setSelectedCoupon(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {coupons.map((coupon, idx) => (
                    <option key={idx} value={coupon.name}>
                      <span>{coupon.grade}쿠폰 - </span>{coupon.amount}원 할인
                    </option>
                  ))}
                </select>
              </div>
            </div>


            {/* 결제 방식 */}
            <div className="p-6 bg-white border shadow-sm rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold">결제 방식</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label key={method.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={selectedPayment === method.value}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="accent-rose-500"
                    />
                    {method.label}
                  </label>
                ))}
              </div>

              {selectedPayment === "card" && (
                <div className="mt-4 space-y-4">
                  {/* 카드 번호 */}
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-600">
                      카드 번호
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border rounded-md"
                      maxLength={19}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
                        e.target.value = formattedValue;
                        setCardNumber(value);
                      }}
                    />
                    {cardNumber && !/^\d{16}$/.test(cardNumber) && (
                      <p className="text-xs text-red-500">올바른 카드 번호를 입력해주세요.</p>
                    )}
                  </div>

                  {/* 유효기간 */}
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-600">
                      유효기간
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="MM"
                        className="w-1/2 px-3 py-2 border rounded-md"
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 2) {
                            e.target.value = value;
                            setExpiryMonth(value);
                          }
                        }}
                      />
                      <input
                        type="text"
                        placeholder="YY"
                        className="w-1/2 px-3 py-2 border rounded-md"
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 2) {
                            e.target.value = value;
                            setExpiryYear(value);
                          }
                        }}
                      />
                    </div>
                    {expiryMonth && expiryYear && !isValidExpiryDate(expiryMonth, expiryYear) && (
                      <p className="text-xs text-red-500">유효하지 않은 만료일입니다.</p>
                    )}
                  </div>

                  {/* CVC */}
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-600">
                      CVC
                    </label>
                    <input
                      type="password"
                      placeholder="123"
                      className="w-full px-3 py-2 border rounded-md"
                      maxLength={3}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          e.target.value = value;
                          setCvc(value);
                        }
                      }}
                    />
                    {cvc && !/^\d{3}$/.test(cvc) && (
                      <p className="text-xs text-red-500">올바른 CVC를 입력해주세요.</p>
                    )}
                  </div>

                  {/* 비밀번호 */}
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-600">
                      카드 비밀번호 앞 2자리
                    </label>
                    <input
                      type="password"
                      placeholder="**"
                      className="w-full px-3 py-2 border rounded-md"
                      maxLength={2}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 2) {
                          e.target.value = value;
                          setCardPassword(value);
                        }
                      }}
                    />
                    {cardPassword && !/^\d{2}$/.test(cardPassword) && (
                      <p className="text-xs text-red-500">올바른 비밀번호를 입력해주세요.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 결제 요약 사이드바 */}
          <div className="p-6 space-y-6 bg-white border shadow-md md:sticky md:top-[120px] h-fit rounded-2xl">
            <h2 className="text-[18px] font-semibold">결제 요약</h2>
            <div className="text-gray-700">
              {reservations.map((res, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <span>{res.isAccommodation ? res.title.replace(" 예약", "") : "공연 예매"}</span>
                  <span>
                    {res.isAccommodation
                      ? res.price
                      : res.totalPrice ? `₩${res.totalPrice.toLocaleString()}` : '₩0'}
                  </span>
                </div>
              ))}
              {couponDiscount > 0 && (
                <div className="flex justify-between mb-2 text-sm text-red-500">
                  <span>쿠폰 할인</span>
                  <span>-₩{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <hr />
              <div className="flex flex-col items-end mt-4 space-y-2">
                <div className="text-lg font-bold">
                  {selectedCoupon ? (
                    <>
                      <span className="mr-2 text-gray-500 line-through">₩{total.toLocaleString()}</span>
                      <span className="text-green-600">₩{finalTotal.toLocaleString()}</span>
                    </>
                  ) : (
                    <span>₩{total.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <button
                className="w-full py-4 mt-4 text-lg text-white transition bg-rose-500 hover:bg-rose-600 rounded-xl disabled:bg-gray-400"
                disabled={isLoading}
                onClick={() => {
                  if (!isLoading) {
                    handlePayment();
                  }
                }}
              >
                {isLoading ? "결제 처리 중..." : "결제하기"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
