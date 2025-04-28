import React, { useState } from "react";

export default function Sidebar({ setCurrentSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative lg:w-64">
      <div className="mb-4 lg:hidden">
        <button
          className="px-4 py-2 bg-gray-100 rounded-lg shadow"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰ 메뉴
        </button>
      </div>
      <div
        className={`bg-white shadow rounded-2xl p-4 lg:block ${
          isOpen ? "block" : "hidden"
        } w-full`}
      >
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => {
                setCurrentSection("overview");
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-100"
            >
              예약/쿠폰
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCurrentSection("usersettings");
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-100"
            >
              회원 설정
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
