import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function CancleBtn({ text, orderId, type, onClick }) {
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleWithdraw = async () => {
    const confirmed = window.confirm(`정말로 ${text}하시겠습니까?`);
    if (!confirmed) return;

    try {
      if (onClick) {
        // 커스텀 onClick 핸들러가 있는 경우
        onClick();
      } else if (orderId) {
        // 예약 취소 API 호출
        const response = await axios.delete(
          `http://localhost:9000/${
            type === "theme" ? "order" : "accorder"
          }/cancel/${orderId}`
        );

        if (response.status === 200) {
          toast.success("예약이 성공적으로 취소되었습니다.");
          window.location.reload();
        }
      }
    } catch (err) {
      console.error(`${text} 에러:`, err);
      toast.error(`${text}에 실패했습니다.`);
    }
  };

  return (
    <div className="mt-4 text-right">
      {!showWithdraw && (
        <button
          onClick={() => setShowWithdraw(true)}
          className="text-xs text-gray-400 underline transition-colors hover:text-red-500"
        >
          {`${text}하시겠습니까?`}
        </button>
      )}
      {showWithdraw && (
        <button
          onClick={handleWithdraw}
          className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200"
        >
          {`정말 ${text}하시겠습니까?`}
        </button>
      )}
    </div>
  );
}
