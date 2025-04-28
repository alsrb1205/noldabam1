import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSeatInfo } from './utils.js';

export const ReservationModal = ({ 
    showModal, 
    onClose, 
    locationState, 
    selectedDate, 
    selectedSeats, 
    floorsConfig, 
    calculateTotalPrice 
}) => {
    const navigate = useNavigate();

    const handleReservation = () => {
        // 예약 정보를 상태에 저장하고 예약 페이지로 이동
        navigate('/reservation', {
            state: {
                type: 'performance',
                performance: locationState,
                date: selectedDate,
                seats: selectedSeats.map(seat => {
                    const seatInfo = getSeatInfo(seat);
                    const floorConfig = floorsConfig.find(f => f.floor === seat.split('-')[0]);
                    const gradeInfo = floorConfig?.seatGrades[seatInfo?.grade];
                    return {
                        seat_id: seat,
                        seat_grade: seatInfo.grade,
                        seat_price: gradeInfo.price
                    };
                }),
                totalPrice: calculateTotalPrice()
            }
        });
    };

    return (
        showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full p-6 bg-white rounded-lg" style={{ 
                    maxWidth: window.innerWidth >= 768 ? "500px" : "400px"
                }}>
                    <div className="flex items-center mb-4">
                        <div className="relative overflow-hidden rounded-lg w-[100px] h-[133px] flex-shrink-0">
                            <img
                                src={locationState.image || '/default.jpg'}
                                alt={locationState.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="ml-4">
                            <h2 className={`font-bold ${window.innerWidth >= 1024 ? 'text-2xl' : 'text-lg'}`}>{locationState.title}</h2>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="mb-2 text-[16px] font-bold">예매 정보</h3>
                        <p className='text-[13px]'>예매일: {selectedDate}</p>
                        <div className="mt-2">
                            <h4 className="mb-2 font-bold">선택한 좌석</h4>
                            {selectedSeats.map((seat, index) => {
                                const seatInfo = getSeatInfo(seat);
                                const floorConfig = floorsConfig.find(f => f.floor === seat.split('-')[0]);
                                const gradeInfo = floorConfig?.seatGrades[seatInfo?.grade];
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 flex-shrink-0 ${gradeInfo?.className} rounded-full shadow-md`}></div>
                                            <span className='text-[13px]'>{seat}</span>
                                            <span className="ml-2 text-[13px]">
                                                {seatInfo ? `${seatInfo.grade} (${gradeInfo?.price.toLocaleString()})` : ''}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4">
                            <h4 className="mb-1 font-bold">총 결제 금액</h4>
                            <p className="text-xl font-bold text-blue-600">{calculateTotalPrice().toLocaleString()}원</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleReservation}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            예약하기
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}; 
