// components/FloorLayout.js
/*
 * FloorLayout.js
 * - 각 층(Floor)의 좌석 레이아웃을 렌더링하는 컴포넌트와, 모든 층을 함께 렌더링하는 AllFloorsLayout를 포함합니다.
 */
import React, { Fragment } from 'react';
import { seatWidth, effectiveSeatWidth, effectiveSeatHeight } from './config.js';

/**
 * FloorLayout
 * - 단일 층의 좌석 및 라벨, 컬럼 번호를 렌더링합니다.
 * @param {object} props
 * @param {object} props.config - 해당 층의 설정 정보
 * @param {array} props.selectedSeats - 선택된 좌석 ID 목록
 * @param {function} props.onSeatSelect - 좌석 선택 시 호출되는 콜백 함수
 * @param {object} props.clickPreventRef - 드래그시 클릭 무시 처리용 Ref
 * @param {boolean} props.isPanning - 현재 팬(pan) 중인지 여부
 * @param {array} props.reservedSeats - 예약된 좌석 ID 목록
 * @param {boolean} props.selectedDate - 선택된 날짜 여부
 */
export const FloorLayout = ({ config, selectedSeats, onSeatSelect, clickPreventRef, isPanning, reservedSeats, selectedDate }) => {
    const { floor, rows, blocks, seatGrades, rowGradeMapping } = config;
    const rowElements = [];

    // 각 행에 대한 좌석 셀 생성
    for (let r = 0; r < rows; r++) {
        const rowLetter = String.fromCharCode(65 + r);
        let seatCounter = 0;
        const rowCells = [];

        blocks.forEach((block, blockIndex) => {
            if (block.type === 'seat') {
                for (let i = 0; i < block.seats; i++) {
                    seatCounter++;
                    const seatId = `${floor}-${rowLetter}-${seatCounter}`;
                    // 기본 좌석 등급에서 행별 오버라이드 적용
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
                    const gradeInfo = seatGrades[finalGrade];
                    const isReserved = reservedSeats?.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    rowCells.push(
                        <div
                            key={`${seatId}-${blockIndex}-${i}`}
                            className="flex items-center justify-center"
                            style={{ width: effectiveSeatWidth, height: effectiveSeatHeight }}
                        >
                            <button
                                // onMouseDown 시 시작 위치 기록
                                onMouseDown={(e) => {
                                    e.currentTarget.dataset.startX = e.clientX;
                                    e.currentTarget.dataset.startY = e.clientY;
                                }}
                                onClick={(e) => {
                                    if (isReserved) return;
                                    const startX = parseFloat(e.currentTarget.dataset.startX);
                                    const startY = parseFloat(e.currentTarget.dataset.startY);
                                    const dx = Math.abs(e.clientX - startX);
                                    const dy = Math.abs(e.clientY - startY);
                                    // 드래그 중이면 클릭 무시
                                    if (dx > 1 || dy > 1 || isPanning) {
                                        e.preventDefault();
                                        return;
                                    }
                                    onSeatSelect(seatId);
                                }}
                                className={` shadow-md focus:outline-none ${gradeInfo.className} ${isSelected 
                                            ? 'ring-2 ring-black' : (isPanning ? 'cursor-grabbing' : 'cursor-pointer hover:scale-110')} ${isReserved ? '!bg-gray-200 !cursor-not-allowed' : ''} ${!selectedDate ? 'opacity-10 blur-[1px]' : ''}`}
                                style={{ width: seatWidth, height: seatWidth }}
                                title={`${seatId} (${finalGrade} ${gradeInfo.price})`}
                            >
                            </button>
                        </div>
                    );
                }
            } else if (block.type === 'label') {
                // 행 라벨 셀
                rowCells.push(
                    <div
                        key={`${floor}-${rowLetter}-label-${blockIndex}`}
                        className="flex items-center justify-center text-xs font-bold text-black"
                        style={{ width: effectiveSeatWidth, height: effectiveSeatHeight }}
                    >
                        {rowLetter}
                    </div>
                );
            }
        });

        const rowWidth = rowCells.length * effectiveSeatWidth;
        rowElements.push(
            <div key={`${floor}-row-${r}`} className="flex justify-center w-full">
                <div style={{ width: rowWidth, display: 'flex' }}>{rowCells}</div>
            </div>
        );
    }

    // 컬럼 번호 생성
    let colNumbers = [];
    let seatNum = 0;
    blocks.forEach((block, blockIndex) => {
        if (block.type === 'seat') {
            for (let i = 0; i < block.seats; i++) {
                seatNum++;
                colNumbers.push(
                    <div
                        key={`${floor}-col-${blockIndex}-${i}`}
                        className="flex items-center justify-center text-xs text-black"
                        style={{ width: effectiveSeatWidth, height: effectiveSeatHeight }}
                    >
                        {seatNum}
                    </div>
                );
            }
        } else if (block.type === 'label') {
            colNumbers.push(
                <div
                    key={`${floor}-col-label-${blockIndex}`}
                    style={{ width: effectiveSeatWidth, height: effectiveSeatHeight }}
                ></div>
            );
        }
    });
    const colRowWidth = colNumbers.length * effectiveSeatWidth;

    return (
        <Fragment>
            {/* 1층인 경우 STAGE 영역 렌더링 */}
            {floor === "1F" && (
                <div className={`flex justify-center mb-5 ${!selectedDate ? 'opacity-50 blur-[1px]' : ''}`}>
                    <div className="w-full max-w-[650px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-10 text-center text-2xl font-bold rounded-3xl">
                        STAGE
                    </div>
                </div>
            )}
            <div className={`flex justify-center w-full ${!selectedDate ? 'opacity-50 blur-[1px]' : ''}`}>
                <div className="inline-flex flex-col items-center">
                    {rowElements}
                    <div className="flex justify-center w-full" style={{ margin: "5px 0" }}>
                        <div style={{ width: colRowWidth, display: 'flex' }}>{colNumbers}</div>
                    </div>
                    <div className="flex justify-center">
                        <div
                            className="flex items-center justify-center w-12 h-12 my-3 text-xl font-bold text-white bg-black rounded-full"
                            style={{ marginBottom: "10px" }}
                        >
                            {floor}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

/**
 * AllFloorsLayout
 * - 모든 층의 레이아웃을 한꺼번에 렌더링합니다.
 */
export const AllFloorsLayout = ({ floors, selectedSeats, onSeatSelect, clickPreventRef, isPanning, reservedSeats, selectedDate }) => (
    <div>
        {floors.map((floorConfig) => (
            <FloorLayout
                key={floorConfig.floor}
                config={floorConfig}
                selectedSeats={selectedSeats}
                onSeatSelect={onSeatSelect}
                clickPreventRef={clickPreventRef}
                isPanning={isPanning}
                reservedSeats={reservedSeats}
                selectedDate={selectedDate}
            />
        ))}
    </div>
);