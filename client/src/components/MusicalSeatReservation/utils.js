// utils/utils.js
/*
 * utils.js
 * - 레이아웃의 최대 너비 및 전체 높이를 계산하는 함수와,
 *   좌석 ID("1F-A-5" 형태)를 파싱하여 좌석 정보를 반환하는 유틸 함수들을 포함합니다.
 */
import { floorsConfig, effectiveSeatWidth, effectiveSeatHeight } from './config.js';

/**
 * getMaxRowWidth
 * - 모든 층의 최대 행 너비를 계산합니다.
 */
export const getMaxRowWidth = () => {
    return Math.max(
        ...floorsConfig.map(floor => {
            const totalCells = floor.blocks.reduce(
                (sum, block) => block.type === 'seat' ? sum + block.seats : sum + 1,
                0
            );
            return totalCells * effectiveSeatWidth;
        })
    );
};

/**
 * getTotalContentHeight
 * - 모든 층의 총 높이를 계산합니다.
 */
export const getTotalContentHeight = () => {
    return floorsConfig.reduce(
        (sum, floor) => sum + floor.rows * effectiveSeatHeight,
        0
    );
};

/**
 * getSeatInfo
 * - 좌석 ID를 파싱하여 해당 좌석의 층, 행, 열, 등급, 가격 등의 정보를 반환합니다.
 * @param {string} seatId - "1F-A-5" 형식의 좌석 ID
 * @returns {object|null} - 좌석 정보 객체 또는 유효하지 않을 경우 null 반환
 */
export const getSeatInfo = (seatId) => {
    const parts = seatId.split("-");
    if (parts.length !== 3) return null;
    const [floorId, rowLetter, seatNumStr] = parts;
    const seatNum = parseInt(seatNumStr, 10);
    const floorConfig = floorsConfig.find(f => f.floor === floorId);
    if (!floorConfig) return null;
    let remaining = seatNum;
    let baseGrade = null;
    for (const block of floorConfig.blocks) {
        if (block.type === 'seat') {
            if (remaining <= block.seats) {
                baseGrade = block.grade;
                break;
            } else {
                remaining -= block.seats;
            }
        }
    }
    if (!baseGrade) return null;

    // 행별 등급 오버라이드 적용
    let finalGrade = baseGrade;
    if (floorConfig.rowGradeMapping) {
        const rowCode = rowLetter.charCodeAt(0);
        for (const mapping of floorConfig.rowGradeMapping) {
            const startCode = mapping.startRow.charCodeAt(0);
            const endCode = mapping.endRow.charCodeAt(0);
            if (rowCode >= startCode && rowCode <= endCode) {
                finalGrade = mapping.grade;
                break;
            }
        }
    }

    const priceStr = floorConfig.seatGrades[finalGrade].price;
    const priceNumber = parseInt(priceStr.replace(/[₩,]/g, ""), 10);
    return { floor: floorId, row: rowLetter, col: seatNum, grade: finalGrade, price: priceStr, priceNumber };
};