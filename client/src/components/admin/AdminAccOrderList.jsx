export default function AdminAccOrderList({findMenu, accommodationOrders}) {
    return (
        <div>
            {findMenu === "accOrder" ? <section className="mb-10" >
                <h2 className="mb-2 text-xl font-semibold">숙박 주문 리스트</h2>
                <table className="w-full border border-gray-300 border-collapse">
  <thead className="bg-gray-200">
    <tr>
      <th className="border border-gray-300 p-2">주문 ID</th>
      <th className="border border-gray-300 p-2">이미지</th>
      <th className="border border-gray-300 p-2">주문자 ID</th>
      <th className="border border-gray-300 p-2">숙소명</th>
      <th className="border border-gray-300 p-2">숙소ID</th>
      <th className="border border-gray-300 p-2">룸명</th>
      <th className="border border-gray-300 p-2">주소</th>
      <th className="border border-gray-300 p-2">인원</th>
      <th className="border border-gray-300 p-2">체크인~체크아웃</th>
      <th className="border border-gray-300 p-2">가격</th>
      <th className="border border-gray-300 p-2">주문일</th>
    </tr>
  </thead>
  <tbody className="text-center">
    {accommodationOrders.map((order) => (
      <tr key={order.order_id} className="hover:bg-gray-50">
        <td className="border border-gray-300 p-2">{order.order_id}</td>
        <td className="border border-gray-300 p-2">
          <img
            src={order.image_url || "/images/acc/room.jpg"}
            alt={order.accommodation_name}
            className="w-16 h-16 object-cover mx-auto"
          />
        </td>
        <td className="border border-gray-300 p-2">{order.user_id}</td>
        <td className="border border-gray-300 p-2">{order.accommodation_name}</td>
        <td className="border border-gray-300 p-2">{order.accommodation_id}</td>
        <td className="border border-gray-300 p-2">{order.room_name}</td>
        <td className="border border-gray-300 p-2">{order.address}</td>
        <td className="border border-gray-300 p-2">{order.user_count}명</td>
        <td className="border border-gray-300 p-2">
          {new Date(order.checkin_date).toLocaleDateString("en-CA")} ~{" "}
          {new Date(order.checkout_date).toLocaleDateString("en-CA")}
        </td>
        <td className="border border-gray-300 p-2">
          {order.total_price.toLocaleString()}원
        </td>
        <td className="border border-gray-300 p-2">
          {new Date(order.order_date).toLocaleDateString("en-CA")}
        </td>
      </tr>
    ))}
  </tbody>
</table>

            </section> : ""}
        </div>
    );
};