import React from "react";

export default function PerformanceReservationItem({ res }) {
    return (
        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl !mt-0">
            <div className="flex flex-col sm:flex">
                <div className="flex min-h-[8rem] sm:min-h-[12rem] md:min-h-[16rem] sm:border-b">
                    <div className="w-[160px] shrink-0 md:w-[210px]">
                        <img
                            src={res.image}
                            alt={`${res.title} 포스터`}
                            className="object-contain w-full h-auto"
                            onError={(e) => {
                                e.target.src = "https://kdigitaltwin.net/uploaded/product/3/large_bef512f46eb26a095ab697e76f4b35ea0.jpg";
                            }}
                        />
                    </div>
                    <div className="flex flex-col justify-between w-full p-3">
                        <div>
                            <div>
                                <h2 className="mb-1 font-semibold text-[16px] md:text-[18px] md:mb-2">{res.title}</h2>
                            </div>
                            <div className="flex flex-col justify-between text-xs text-gray-700 sm:text-sm md:text-base">
                                <div>
                                    <span className="text-[11px] md:text-[13px]">{res.venue}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] md:text-[13px]">{res.venueAddress}</span>
                                </div>
                                <div className="text-[11px] md:text-[13px]">예매날짜: {res.date}</div>

                                <div className="">
                                    <div className="text-[11px] md:text-[13px]">선택한 좌석: </div>
                                    <div className="ml-2">
                                        {res.seats?.map((seat, index) => (
                                            <div key={index} className="font-extrabold text-black text-[10px] md:text-[11px]">
                                                {seat.seat_id} ({seat.seat_grade} - {seat.seat_price.toLocaleString()})
                                            </div>
                                        )) || '좌석 정보 없음'}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="text-sm font-semibold text-right text-gray-800 sm:text-base md:text-lg">
                            ₩{res.totalPrice?.toLocaleString() || '0'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 