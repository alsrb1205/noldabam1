import { useState, useRef } from "react";
import axios from "axios";

export const useKakaoPayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isProcessing = useRef(false);

    const formatTitle = (title) => {
        if (!title || title.length === 0) return "";
        const firstTitle = title[0];
        if (typeof firstTitle === 'object') {
            // 숙박 예약인 경우
            return firstTitle.accommodation_name || firstTitle.title || "";
        }
        // 공연 예약인 경우
        const firstTitleWords = firstTitle.split(" ");
        const formattedFirstTitle = firstTitleWords.length > 2 ? `${firstTitleWords[0]}...` : firstTitle;
        if (title.length === 1) return firstTitle;
        return `${formattedFirstTitle} 외 ${title.length - 1}건`;
    };

    const handleKakaoPayment = async (orderDataList, userData) => {
        if (!orderDataList.length || !userData) {
            console.error("ERROR 결제 요청을 위한 데이터가 부족합니다.");
            return;
        }
        if (isProcessing.current) {
            console.warn("이미 결제가 진행 중입니다.");
            return;
        }
        isProcessing.current = true;
        setLoading(true);

        try {
            const itemNames = orderDataList.map(order => {
                if (order.accommodation_id) {
                    return order.accommodation_name;
                }
                return order.title;
            });
            const totalPrice = orderDataList.reduce((sum, order) => {
                if (order.accommodation_id) {
                    return sum + order.price;
                }
                return sum + order.total_price;
            }, 0);
            
            const res = await axios.post('http://localhost:9000/payment/qr', {
                id: userData.id || userData.user_id,
                item_name: formatTitle(itemNames),
                total_amount: totalPrice,
                orderDataList: orderDataList
            });

            if (res.data.next_redirect_pc_url) {
                // 결제 요청 시 사용한 ID 저장
                const paymentUserId = userData.id || userData.user_id;
                localStorage.setItem("kakao_payment_user_id", paymentUserId);
                
                localStorage.setItem("kakao_tid", res.data.tid);
                localStorage.setItem("kakao_orderData", JSON.stringify({
                    ...orderDataList[0],
                    partner_order_id: res.data.partner_order_id,
                    user_id: paymentUserId  // 결제 요청 시 사용한 ID 저장
                }));
                window.location.href = res.data.next_redirect_pc_url;
            }
        } catch (error) {
            console.error("ERROR 카카오페이 결제 요청 실패:", error);
            setError(error);
        } finally {
            setLoading(false);
            isProcessing.current = false;
        }
    };

    return { handleKakaoPayment, loading, error };
}; 