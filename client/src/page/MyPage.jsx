import React, { useState } from "react";
import Coupon from "../components/mypage/Coupon";
import UserProfile from "../components/mypage/UserProfile";
import Sidebar from "../components/mypage/Sidebar";
import ReservationTaps from "../components/mypage/ReservationTaps.jsx";
import UserSettings from "../components/mypage/UserSettings.jsx";

export default function MyPage() {
  const [currentSection, setCurrentSection] = useState("overview");

  return (
    <>
      <img
        className="w-full h-[300px] object-cover"
        src="/images/banner/banner3.jpg" alt="" />
      <div
        className={`px-4 py-10 mx-auto max-w-7xl relative`}
      >
        <h1 className="absolute top-[-70px] left-[20px] mb-6 text-white text-4xl font-bold">마이페이지</h1>
        <div className="flex flex-col gap-6 lg:flex-row">
          <Sidebar setCurrentSection={setCurrentSection} />
          <div className="flex-1 space-y-6">
            {currentSection === "usersettings" && <UserSettings setCurrentSection={setCurrentSection} />}
            {currentSection === "overview" && (
              <>
                <UserProfile />
                <ReservationTaps />
                <Coupon />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
