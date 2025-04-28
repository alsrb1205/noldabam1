import React, { Fragment } from 'react';
import { getSeatInfo } from './utils.js';

export const SelectedSeatsArea = ({ selectedSeats, floorsConfig, onRemoveSeat }) => {
    return (
        <div>
            <div className="pb-[10px] text-base font-bold border-b-2">선택 좌석</div>
            {selectedSeats.length > 0 ? (
                <Fragment>
                    {selectedSeats.map((seat, index) => {
                        const seatInfo = getSeatInfo(seat);
                        const floorConfig = floorsConfig.find(f => f.floor === seat.split('-')[0]);
                        const gradeInfo = floorConfig?.seatGrades[seatInfo?.grade];
                        return (
                            <div key={index} className="flex items-center justify-between border-b border-gray-300">
                                <div className="flex items-center gap-2 mt-2">
                                    <div className={`w-4 h-4 flex-shrink-0 ${gradeInfo?.className}  shadow-md`}></div>
                                    <div className="text-[12px]">
                                        {seat}
                                        <span className="ml-2">
                                            {seatInfo && `${seatInfo.grade} (${seatInfo.price})`}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemoveSeat(seat)}
                                    className="text-sm text-red-500 focus:outline-none"
                                >
                                    X
                                </button>
                            </div>
                        );
                    })}
                </Fragment>
            ) : (
                <p className="text-sm text-center">선택된 좌석이 없습니다.</p>
            )}
        </div>
    );
}; 