import axios from "axios";
import { useReview } from "../../context/ReviewContext";

export default function AccommodationReview({ accommodationId }) { // 숙박 리뷰 모달
    const { refreshReviews } = useReview();

    // ✅ 버튼 클릭 시 리뷰 등록 요청
    const sendTestReview = async () => {
        console.log("📡 리뷰 저장 요청 시작");

        try {
            const response = await axios.post("http://localhost:9000/review/write", {
                orderId: "ORD00120",
                reviewContent: "바다가 잘 보이는 곳이었어요",
                rating: 5
            });
            console.log("✅ 리뷰 저장 성공:", response.data);
            
            // 리뷰 작성 후 데이터 갱신
            if (accommodationId) {
                await refreshReviews(accommodationId);
            }
        } catch (error) {
            console.error("❌ 리뷰 저장 실패:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h1>숙박 리뷰 모달</h1>
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