import React, { useState } from "react";
import ReservationTheme from "./ReservationTheme";
import ReservationStay from "./ReservationStay";

export default function ReservationTaps() {
  const [tab, setTab] = useState("stay");

  return (
    <div className="w-full pt-[24px]">
      <div className="flex mb-4 space-x-4">
        <button
          onClick={() => setTab("stay")}
          className={`px-4 py-2 rounded-full font-medium transition ${
            tab === "stay"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          숙박 예약
        </button>
        <button
          onClick={() => setTab("theme")}
          className={`px-4 py-2 rounded-full font-medium transition ${
            tab === "theme"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          테마/공연 예약
        </button>
      </div>
      {tab === "stay" && <ReservationStay />}
      {tab === "theme" && <ReservationTheme />}
    </div>
  );
}
