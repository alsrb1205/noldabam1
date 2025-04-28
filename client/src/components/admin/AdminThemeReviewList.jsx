export default function AdminThemeReviewList({ findMenu, themeReviews, onDeleteReview }) {
  
  return (
    <div>
      {findMenu === 'themeReview' ? (
        <section>
          <h2 className="mb-2 text-xl font-semibold">테마 리뷰 리스트</h2>
          <table className="w-full border border-collapse border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border border-gray-300">아이디</th>
                <th className="p-2 border border-gray-300">이미지</th>
                <th className="p-2 border border-gray-300">테마 코드</th>
                <th className="p-2 border border-gray-300">평점</th>
                <th className="p-2 border border-gray-300">후기</th>
                <th className="p-2 border border-gray-300">작성 일자</th>
                <th className="p-2 border border-gray-300">관리</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {themeReviews.map((r) => (
                <tr key={r.orderId} className="hover:bg-gray-50">
                  <td className="p-2 border border-gray-300">{r.user_id}</td>
                  <td className="p-2 border border-gray-300">
                    {r.images && r.images.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {r.images.map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:9000/${image}`}
                            alt={`리뷰 이미지 ${index + 1}`}
                            className="object-contain rounded w-14 h-14"
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">없음</span>
                    )}
                  </td>
                  <td className="p-2 border border-gray-300">{r.performance_id}</td>
                  <td className="p-2 text-yellow-500 border border-gray-300">
                    {"★".repeat(r.star)}
                    <span className="text-gray-400">{r.star}/5</span>
                  </td>
                  <td className="p-2 border border-gray-300">{r.comment}</td>
                  <td className="p-2 border border-gray-300">{r.date}</td>
                  <td className="p-2 border border-gray-300">
                    <button
                      onClick={() => onDeleteReview(r.id)}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}
