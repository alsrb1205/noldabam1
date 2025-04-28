import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function AdminLogin() {
  
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/active"); // ✅ 토큰 있으면 관리자 페이지로 바로 이동
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    adminId: "",
    adminPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  // 로그인 버튼 클릭 시
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const idRegex = /^[a-zA-Z0-9]+$/; // 정규식
  
    if (!formData.adminId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    if (!formData.adminPassword.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
  
    if (!idRegex.test(formData.adminId)) {
      alert("아이디는 영문과 숫자만 사용할 수 있으며, 공백 및 한글이나 특수문자는 사용할 수 없습니다.");
      return;
    }
  
    if (!idRegex.test(formData.adminPassword)) {
      alert("비밀번호는 영문과 숫자만 사용할 수 있으며, 한글이나 특수문자는 사용할 수 없습니다.");
      return;
    }
  
    // ✅ 유효성 통과 → 로그인 요청
    try {
      const res = await axios.post("http://localhost:9000/admin/getAuth", formData);
  
      if (res.data.success) {
        // ✅ JWT 토큰 저장
        localStorage.setItem("adminToken", res.data.token);
        alert("로그인 성공!");
  
        // ✅ 토큰을 이용해 /admin/active 요청
        const token = localStorage.getItem("adminToken");
  
        const authRes = await axios.get("http://localhost:9000/admin/active", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (authRes.data.success) {
          // 관리자 대시보드로 이동
          navigate('/admin/active');
        } else {
          alert("접근 권한이 없습니다. 다시 로그인해주세요.");
          navigate('/admin');

        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("❌ 에러:", err);
      alert("서버 오류 또는 인증 실패가 발생했습니다.");
      window.location.href = "/admin";
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">관리자 로그인</h2>

        <div className="flex flex-col">
          <label htmlFor="adminId" className="mb-1 text-sm font-medium text-gray-700">
            아이디
          </label>
          <input
            type="text"
            name="adminId"
            id="adminId"
            value={formData.adminId}
            onChange={handleChange}
            placeholder="영문/숫자만 입력"
            className="px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="adminPassword" className="mb-1 text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            type="password"
            name="adminPassword"
            id="adminPassword"
            value={formData.adminPassword}
            onChange={handleChange}
            placeholder="영문/숫자만 입력"
            className="px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
