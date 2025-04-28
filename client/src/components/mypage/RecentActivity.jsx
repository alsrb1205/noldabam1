import React from "react";

export default function RecentActivity() {
  const recentItems = [
    {
      title: "강릉 오션뷰 리조트",
      type: "숙소",
      image:
        "https://ak-d.tripcdn.com/images/220a15000000xefhnB3B7_W_400_400_R5.webp?default=1",
    },
    {
      title: "뮤지컬 엘리자벳",
      type: "공연",
      image:
        "https://ak-d.tripcdn.com/images/220a15000000xefhnB3B7_W_400_400_R5.webp?default=1",
    },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-2xl">
      <h2 className="mb-4 text-xl font-semibold">최근 본 항목</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recentItems.map((item, i) => (
          <li key={i} className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.title}
              className="object-cover w-20 h-20 rounded-lg"
            />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">{item.type}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
