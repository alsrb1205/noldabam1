import React from 'react';
import { getSeatInfo } from './utils.js';

/*
 * LegendArea.jsx
 * - 각 층별 좌석의 등급과 가격, 총 좌석 수와 선택된 좌석 수를 반영하여 잔여 좌석을 보여줍니다.
 */
export const LegendArea = ({ floors, selectedSeats }) => {
    return (
        <div>
            <div className="mb-[10px] text-base font-bold">좌석 정보</div>
            {floors.map((floorConfig) => {
                const { floor, rows, blocks, seatGrades, rowGradeMapping } = floorConfig;
                const legendData = {};

                // 각 행별로 좌석 수 집계 (총 좌석 수)
                for (let r = 0; r < rows; r++) {
                    const rowLetter = String.fromCharCode(65 + r);
                    blocks.forEach((block) => {
                        if (block.type === 'seat') {
                            let finalGrade = block.grade;
                            if (rowGradeMapping) {
                                const rowCode = rowLetter.charCodeAt(0);
                                for (const mapping of rowGradeMapping) {
                                    const startCode = mapping.startRow.charCodeAt(0);
                                    const endCode = mapping.endRow.charCodeAt(0);
                                    if (rowCode >= startCode && rowCode <= endCode) {
                                        finalGrade = mapping.grade;
                                        break;
                                    }
                                }
                            }
                            legendData[finalGrade] = (legendData[finalGrade] || 0) + block.seats;
                        }
                    });
                }

                // 각 등급별로 선택된 좌석 수 계산
                const selectedData = {};
                selectedSeats.forEach((seatId) => {
                    const info = getSeatInfo(seatId);
                    if (info && info.floor === floor) {
                        selectedData[info.grade] = (selectedData[info.grade] || 0) + 1;
                    }
                });

                return (
                    <div key={floor} className="mb-1 text-[14px]">
                        <div className="font-bold ">{floor}</div>
                        <div className="flex flex-col">
                            {Object.entries(legendData).map(([grade, total], index) => {
                                const info = seatGrades[grade];
                                const selectedCount = selectedData[grade] || 0;
                                const remaining = total - selectedCount;
                                return (
                                    <div key={`${floor}-${grade}-${index}`} className="flex items-center gap-1 space-y-1">
                                        <div className={`w-4 h-4 ${info.className}  shadow-md`}>

                                        </div>
                                            {grade} ({info.price}) 
                                            <span className='ml-2 text-red-500'>
                                                잔여 {remaining}석
                                            </span>
                                        
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
