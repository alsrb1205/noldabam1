import React, { useState, useEffect } from "react";
import axios from "axios";
export default function Coupon() {
  // const [defaultCoupons] = useState([
  //   { grade: "WELCOME10", amount: "10% 할인", expires: "2025-12-31" }
  // ]); 회원가입 시 firebase에 coupons로 넣어야 함
  const [coupons, setCoupons] = useState([]);
  const userId = localStorage.getItem("user_id");

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

  return (
    <div className="w-full p-6 bg-white shadow rounded-2xl">
      <h2 className="mb-4 text-xl font-semibold">보유 쿠폰</h2>
      {coupons.length === 0 ? (
        <p className="text-gray-500">보유한 쿠폰이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {coupons.map((coupon, i) => (
            <li
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{coupon.grade}</p>
                <p className="text-sm text-gray-500">{coupon.amount}원 할인</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
