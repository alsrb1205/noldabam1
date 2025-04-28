import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-yellow-600">결제 취소</h1>
        <p className="text-gray-600 mb-6">결제가 취소되었습니다.</p>
        <button
          onClick={() => navigate('/reservation')}
          className="px-4 py-2 text-white bg-rose-500 rounded-lg hover:bg-rose-600"
        >
          예약 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
} 