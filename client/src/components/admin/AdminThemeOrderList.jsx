export default function AdminThemeOrderList({ findMenu, themeOrders }) {

    return (
        <div>
            {findMenu === "themeOrder" ? <section >
                <h2 className="mb-2 text-xl font-semibold">테마 주문 리스트</h2>
                <table className="w-full border border-collapse border-gray-300">
  <thead className="bg-gray-200">
    <tr>
      <th className="px-4 py-2 border border-gray-300">주문 ID</th>
      <th className="px-4 py-2 border border-gray-300">포스터 이미지</th>
      <th className="px-4 py-2 border border-gray-300">주문자 ID</th>
      <th className="px-4 py-2 border border-gray-300">공연 제목</th>
      <th className="px-4 py-2 border border-gray-300">공연 ID</th>
      <th className="px-4 py-2 border border-gray-300">장르</th>
      <th className="px-4 py-2 border border-gray-300">시설 명 / 주소</th>
      <th className="px-4 py-2 border border-gray-300">좌석 정보</th>
      <th className="px-4 py-2 border border-gray-300">총 주문 가격</th>
      <th className="px-4 py-2 border border-gray-300">주문일</th>
    </tr>
  </thead>
  <tbody className="text-center">
    {themeOrders && themeOrders.map((order) => (
      <tr key={order.order_id}>
        <td className="px-4 py-2 border border-gray-300">{order.order_id}</td>
        <td className="px-4 py-2 border border-gray-300">
          <img src={order.image_url} alt={order.title} className="object-cover w-16 h-16 mx-auto" />
        </td>
        <td className="px-4 py-2 border border-gray-300">{order.user_id}</td>
        <td className="px-4 py-2 border border-gray-300">{order.title}</td>
        <td className="px-4 py-2 border border-gray-300">{order.performance_id}</td>
        <td className="px-4 py-2 border border-gray-300">{order.genre}</td>
        <td className="px-4 py-2 border border-gray-300">{order.venue} / {order.venue_address}</td>
        <td className="px-4 py-2 text-left border border-gray-300">
          {order.seats && order.seats.map((seat, index) => (
            <div key={index} className="mb-1">
              {seat.seat_id} ({seat.seat_grade})
            </div>
          ))}
        </td>
        <td className="px-4 py-2 border border-gray-300">₩{(order.total_price || 0).toLocaleString()}</td>
        <td className="px-4 py-2 border border-gray-300">
          {new Date(order.date).toLocaleDateString('en-CA')}
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </section> : ""}
        </div>
    );
};