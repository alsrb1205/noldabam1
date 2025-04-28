// config/config.js
/*
 * config.js
 * - 좌석 간격, 크기 등 공통 사이즈 설정.
 * - 각 층별 좌석 블록 구성, 좌석 등급, 가격 그리고 행별 등급 오버라이드 정보
 */
export const seatGap = 6;
export const seatWidth = 15;
export const seatHeight = 15;
export const effectiveSeatWidth = seatWidth + seatGap;
export const effectiveSeatHeight = seatHeight + seatGap;
export const labelWidth = 30;
export const blockLabelWidth = effectiveSeatWidth;

// 각 층별 좌석 및 등급 정보
export const floorsConfig = [
    {
        floor: "1F",
        rows: 12, // 행: A ~ L
        blocks: [
            { type: 'seat', seats: 6, grade: 'Regular' },
            { type: 'label' },
            { type: 'seat', seats: 16, grade: 'VIP' },
            { type: 'label' },
            { type: 'seat', seats: 6, grade: 'Regular' }
        ],
        seatGrades: {
            VIP: { price: '₩250,000', className: 'bg-red-500' },
            Regular: { price: '₩200,000', className: 'bg-blue-500' }
        },
        // 행별 등급 오버라이드: A~C는 VIP, D~L은 Regular
        rowGradeMapping: [
            { startRow: "A", endRow: "C", grade: "VIP" },
            { startRow: "D", endRow: "L", grade: "Regular" }
        ]
    },
    {
        floor: "2F",
        rows: 7, // 행: A ~ G
        blocks: [
            { type: 'seat', seats: 9, grade: 'Economy' },
            { type: 'label' },
            { type: 'seat', seats: 16, grade: 'Regular' },
            { type: 'label' },
            { type: 'seat', seats: 9, grade: 'Economy' }
        ],
        seatGrades: {
            Regular: { price: '₩180,000', className: 'bg-purple-500' },
            Economy: { price: '₩150,000', className: 'bg-teal-500' }
        },
        // 행별 등급 오버라이드: A~C는 Regular, D~G는 Economy
        rowGradeMapping: [
            { startRow: "A", endRow: "C", grade: "Regular" },
            { startRow: "D", endRow: "G", grade: "Economy" }
        ]
    },
    {
        floor: "3F",
        rows: 7, // 행: A ~ G
        blocks: [
            { type: 'seat', seats: 11, grade: 'Economy' },
            { type: 'label' },
            { type: 'seat', seats: 16, grade: 'Economy' },
            { type: 'label' },
            { type: 'seat', seats: 11, grade: 'Economy' }
        ],
        seatGrades: {
            Economy: { price: '₩110,000', className: 'bg-orange-500' }
        }
        // 3F는 모든 좌석이 Economy 등급
    }
];