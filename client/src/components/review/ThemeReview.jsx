import axios from "axios";

export default function ThemeReview() { // 테마 리뷰 모달

    // ✅ 버튼 클릭 시 리뷰 등록 요청
    const sendTestReview = async () => {

        try {
            const response = await axios.post("http://localhost:9000/review/write", {
                orderId: "ORD00159",
                reviewContent: "멋진 공연",
                rating: 5
            });
        } catch (error) {
            console.error("❌ 리뷰 저장 실패:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h1>테마 리뷰 모달</h1>
            <p>텍스트 작성</p>
            
            {/* ✅ 리뷰 등록 버튼 */}
            <button
                onClick={sendTestReview}
                className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                테스트용 리뷰 등록
            </button>
        </div>
    );
};