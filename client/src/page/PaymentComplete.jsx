import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PaymentComplete() {
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentComplete = async () => {
      try {
        // URL 파라미터에서 결제 정보 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const pg_token = urlParams.get('pg_token');
        const payment_method = urlParams.get('payment_method');
        const user_id = urlParams.get('user_id');
        const category = urlParams.get('category');
        const isAccommodation = category === 'accommodation';

        // 카카오페이 결제인 경우
        if (pg_token) {
          const tid = localStorage.getItem('kakao_tid');
          const orderData = JSON.parse(localStorage.getItem('kakao_orderData'));
          const paymentUserId = localStorage.getItem('kakao_payment_user_id');

          if (!pg_token || !tid || !orderData || !paymentUserId) {
            throw new Error('결제 정보가 부족합니다');
          }

          // 카카오페이 결제 승인 요청
          const response = await axios.post(
            'http://localhost:9000/payment/approve',
            {
              pg_token,
              tid,
              orderData: {
                ...orderData,
                user_id: paymentUserId
              }
            }
          );

          if (response.data.success) {
            localStorage.removeItem('kakao_tid');
            localStorage.removeItem('kakao_orderData');
            localStorage.removeItem('kakao_payment_user_id');
            setPaymentResult(response.data.result);
          } else {
            throw new Error(response.data.error || '결제 승인 실패');
          }
        }
        // 일반 결제인 경우
        else if (payment_method && user_id) {
          try {
            // isAccommodation 값에 따라 다른 엔드포인트로 요청
            const endpoint = isAccommodation
              ? `http://localhost:9000/accorder/accommodation/latest/${user_id}`
              : `http://localhost:9000/order/performance/latest/${user_id}`;

            const response = await axios.get(endpoint);
            if (response.data.success) {
              setPaymentResult(response.data.order);
            } else {
              throw new Error('주문 정보를 불러오는데 실패했습니다');
            }
          } catch (error) {
            console.error('주문 정보 조회 실패:', error);
            throw new Error('주문 정보를 불러오는데 실패했습니다');
          }
        } else {
          throw new Error('잘못된 결제 정보입니다');
        }
      } catch (error) {
        console.error('❌ 결제 처리 실패:', error);
        setError(error.message);
      }
    };

    handlePaymentComplete();
  }, []);
  useEffect(() => {
    if (paymentResult) {
      const deleteCoupon = async () => {
        try {
          const userId = localStorage.getItem('user_id');
          const usedCoupon = localStorage.getItem('used_coupon');
          
          // 쿠폰을 사용한 경우에만 삭제
          if (userId && usedCoupon === 'true') {
            await axios.delete(`http://localhost:9000/coupons/delete/${userId}`);
            // 쿠폰 사용 상태 초기화
            localStorage.removeItem('used_coupon');
          }
        } catch (err) {
          console.error("❌ 쿠폰 삭제 실패:", err);
        }
      };
  
      deleteCoupon();
    }
  }, [paymentResult]);
  

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-red-600">결제 실패</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">결제 처리 중...</h2>
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">결제가 완료되었습니다!</h2>
        </div>

        <div className="space-y-4">
          {paymentResult.accommodation_name ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">숙소명</span>
                <span className="font-medium">{paymentResult.accommodation_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">객실명</span>
                <span className="font-medium">{paymentResult.room_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">체크인</span>
                <span className="font-medium">
                  {paymentResult.checkin_date ? new Date(paymentResult.checkin_date).toLocaleDateString('ko-KR') : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">체크아웃</span>
                <span className="font-medium">
                  {paymentResult.checkout_date ? new Date(paymentResult.checkout_date).toLocaleDateString('ko-KR') : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">인원</span>
                <span className="font-medium">{paymentResult.user_count}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">주소</span>
                <span className="font-medium">{paymentResult.address}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">공연명</span>
                <span className="font-medium">{paymentResult.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">날짜</span>
                <span className="font-medium">{new Date(paymentResult.date).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">장소</span>
                <span className="font-medium">{paymentResult.venue}</span>
              </div>
              {paymentResult.seats && (
                <div className="mt-4">
                  <h3 className="mb-2 text-lg font-semibold">예매 좌석 정보</h3>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-3 gap-4 mb-2 font-medium text-gray-600">
                      <div>좌석 번호</div>
                      <div>좌석 등급</div>
                      <div>가격</div>
                    </div>
                    {paymentResult.seats.map((seat, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 py-2 border-t">
                        <div className="font-medium text-gray-800">
                          {seat.seat_id}
                        </div>
                        <div className="text-gray-700">
                          {seat.seat_grade}
                        </div>
                        <div className="font-medium text-right text-gray-800">
                          ₩{seat.seat_price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">결제 금액</span>
            <span className="font-medium">₩{(paymentResult.total_price || paymentResult.price || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">결제 방법</span>
            <span className="font-medium">{paymentResult.payment_method === 'kakaopay' ? '카카오페이' : '신용/체크카드'}</span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate('/mypage')}
            className="w-full py-3 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            예약 내역 확인하기
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-800 transition bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}