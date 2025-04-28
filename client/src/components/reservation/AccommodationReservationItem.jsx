import React from "react";

export default function AccommodationReservationItem({ res }) {
    return (
        <div
            className={`border rounded-2xl bg-white shadow-sm overflow-hidden !mt-0`}
        >
            <div className="border-b md:flex md:h-64">
                <div className="w-full h-48 md:w-60 md:h-full shrink-0">
                    <img
                        src={res.image || "/images/acc/room.jpg"}
                        alt={`${res.title} 이미지`}
                        onError={(e) => {
                            e.target.src = "/images/acc/room.jpg";
                        }}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-col justify-between w-full p-4">
                    <div>
                        <h2 className="mb-2  font-semibold text-[18px]">{res.name}</h2>
                    </div>
                    <div className="space-y-0.5 md:space-y-1 text-gray-700 text-[13px]">
                        <div>
                            <span className="font-medium">{res.address}</span>
                        </div>
                        <div>체크인: {res.checkIn}</div>
                        <div>체크아웃: {res.checkOut}</div>
                        <div>객실: {res.roomName}</div>
                        <div>인원: {res.userCount}</div>
                    </div>
                        <div className="text-lg font-semibold text-right text-gray-800">
                            {res.price}
                        </div>
                </div>
            </div>
        </div>
    );
} 