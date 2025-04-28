import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCouponList({ findMenu, coupons, deleteCoupon }) {
  return (
    <div>
      {findMenu === "coupon" ? (
        <section className="mb-10">
          <h2 className="mb-2 text-xl font-semibold">쿠폰 발급 상태</h2>
          <table className="w-full border border-gray-300 border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2">아이디</th>
                <th className="border border-gray-300 p-2">가격</th>
                <th className="border border-gray-300 p-2">등급</th>
                <th className="border border-gray-300 p-2">발급 일자</th>
                <th className="border border-gray-300 p-2">관리</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {coupons.map((coupon, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{coupon.id}</td>
                  <td className="border border-gray-300 p-2">{coupon.amount}원</td>
                  <td className="border border-gray-300 p-2">{coupon.grade}</td>
                  <td className="border border-gray-300 p-2">{coupon.updatedAt || "-"}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="text-red-600 underline hover:font-semibold"
                      onClick={() => deleteCoupon(coupon)}
                    >
                      쿠폰 삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}
