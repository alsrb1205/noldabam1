
import axios from "axios";
export default function AdminUserList({ findMenu, members }) {
  // 로그인 타입 한글 변환 함수
  const getLoginTypeText = (type) => {
    switch (type) {
      case "normal":
        return "일반";
      case "naver":
        return "네이버";
      case "kakao":
        return "카카오";
      case "google":
        return "구글";
      default:
        return type;
    }
  };


  const inputCoupon = async (couponData) => {
    await axios.post("http://localhost:9000/coupons/save", couponData);
  };

  const giveCoupon = (index) => {
    const selectedMember = members[index];

    if (selectedMember.GRADE === "GOLD") {
      alert("GOLD 회원 쿠폰 발급");
      const userCoupon = {
        id: selectedMember.ID,
        name: selectedMember.NAME,
        grade: "GOLD",
        amount: 10000,
      };
      inputCoupon(userCoupon);
    } else if (selectedMember.GRADE === "SILVER") {
      alert("SILVER 회원 쿠폰 발급");
      const userCoupon = {
        id: selectedMember.ID,
        name:selectedMember.NAME,
        grade: "SILVER",
        amount: 5000,
      };
      inputCoupon(userCoupon);
    } else {
      alert("BRONZE 회원은 쿠폰 발급이 되지 않습니다.");
    }
  };

  return (
    <div>
      {findMenu === "user" ? (
        <section className="mb-10">
          <h2 className="mb-2 text-xl font-semibold">회원 리스트</h2>
          <table className="w-full border border-collapse border-gray-300">
  <thead className="bg-gray-200">
    <tr>
      <th className="p-2 border border-gray-300">아이디</th>
      <th className="p-2 border border-gray-300">이름</th>
      <th className="p-2 border border-gray-300">전화번호</th>
      <th className="p-2 border border-gray-300">이메일</th>
      <th className="p-2 border border-gray-300">회원등급</th>
      <th className="p-2 border border-gray-300">쿠폰 발급</th>
      <th className="p-2 border border-gray-300">가입일</th>
      <th className="p-2 border border-gray-300">로그인 방식</th>
    </tr>
  </thead>
  <tbody className="text-center">
    {members.map((member, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="p-2 border border-gray-300">{member.ID}</td>
        <td className="p-2 border border-gray-300">{member.NAME}</td>
        <td className="p-2 border border-gray-300">{member.PHONE || ""}</td>
        <td className="p-2 border border-gray-300">
          {`${member.EMAILNAME}@${member.EMAILDOMAIN}`}
        </td>
        <td className="p-2 border border-gray-300">{member.GRADE}</td>
        <td className="p-2 border border-gray-300">
          <button
            className="px-4 py-2 text-white transition rounded-md bg-sky-400 hover:bg-sky-500"
            onClick={() => giveCoupon(index)}
          >
            쿠폰 발급
          </button>
        </td>
        <td className="p-2 border border-gray-300">
          {new Date(member.MDATE).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </td>
        <td className="p-2 border border-gray-300">
          {getLoginTypeText(member.LOGIN_TYPE)}
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
