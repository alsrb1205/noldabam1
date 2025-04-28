import React from 'react';
import Calendar from '../common/Calendar';

/*
 * ShowInfoDisplay.jsx
 * - 전달받은 공연 정보(제목, 포스터, 장르, 공연 기간)를
 *   포스터는 좌측에 고정 크기로 출력하고, 그 우측에 공연 정보를 약간의 간격을 두고 보여줍니다.
 */
export default function ShowInfoDisplay({ title, image, category, period, selectedDate, onDateChange, minDate, maxDate, fcltynm, venueAddress, genrenm }) {
    return (
        <div className="w-full bg-blue-500 shadow-m pt-[80px]">
            <div className={`flex items-center p-4 text-white w-full`}>
                {/* 왼쪽: 포스터 이미지 - 고정 크기 */}
                <div className={`relative overflow-hidden rounded-lg flex-shrink-0 ${
                    window.innerWidth >= 768 ? 'w-[150px] h-[200px]' : 'w-[100px] h-[160px]'
                }`}>
                    <img
                        src={image || '/default.jpg'}
                        alt={title}
                        className="object-cover w-full h-full"
                    />
                </div>
                {/* 중앙: 공연 정보 */}
                <div className={`ml-4 md:ml-8 flex-1 min-w-0`}>
                    <div className="flex flex-col gap-2">
                        <h2 className={`font-bold text-[20px] truncate`}>{title}</h2>
                        <div className="space-y-1">
                            {fcltynm && (
                                <p className=" text-[14px] font-semibold truncate">
                                    공연시설명:{fcltynm} 
                                </p>
                            )}
                            {venueAddress && (
                                <p className=" text-[14px] font-semibold truncate">
                                    주소:{venueAddress} 
                                </p>
                            )}
                            {genrenm && (
                                <p className=" text-[14px] font-semibold truncate">
                                    장르:{genrenm} 
                                </p>
                            )}
                        </div>
                    </div>
                    {period && (
                        <div className="mt-2  text-[14px]">
                            <span className="font-semibold ">공연 기간:</span>
                            {window.innerWidth < 480 ? <br /> : ' '}
                            {period}
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
}
