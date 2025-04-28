import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMembers, getLogout } from "../../services/authApi.js";
import { setInitialLoginState } from "../../features/auth/authSlice.js";
import CancleBtn from "../../components/mypage/CancleBtn.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UserSettings({ setCurrentSection }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    newPassword: ""
  });
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState(false);

  // localStorage 에서 user_id 가져오기
  const userId = localStorage.getItem("user_id");

  const members = useSelector((state) => state.login?.allMembers || []);

  // 로그인 상태 복원
  useEffect(() => {
    dispatch(setInitialLoginState());
  }, [dispatch]);

  // 회원 리스트 불러오기
  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchAllMembers());
      } catch (error) {
        console.error("회원 정보 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMembers();
  }, [dispatch]);

  // 현재 로그인된 사용자 찾기
  const currentUser = members.find((member) => member.ID === userId);

  // formData 초기값 설정
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.NAME,
        phone: currentUser.PHONE,
        newPassword: ""
      });
    }
  }, [currentUser]);

  // 수정 모드 토글
  const toggleEditMode = () => {
    if (isEditing) {
      // 수정 취소 시 원래 값으로 복원
      setFormData({
        name: currentUser.NAME,
        phone: currentUser.PHONE,
        newPassword: ""
      });
    }
    setIsEditing(!isEditing);
    setMessage("");
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // 숫자만 입력 가능하고 11자리까지만 허용
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 11) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 이름 입력 필드 포커스 아웃 시 검증
  const handleNameBlur = (e) => {
    const name = e.target.value;
    const koreanRegex = /^[가-힣]+$/;
    
    if (name && !koreanRegex.test(name)) {
      setNameError(true);
      toast.error("이름은 한글만 입력 가능합니다.");
    } else {
      setNameError(false);
    }
  };

  // 회원 정보 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 이름 유효성 검사
    const koreanRegex = /^[가-힣]+$/;
    if (!koreanRegex.test(formData.name)) {
      toast.error("이름은 한글만 입력 가능합니다.");
      return;
    }

    // 전화번호 유효성 검사
    if (formData.phone.length !== 11) {
      toast.error("전화번호는 11자리여야 합니다.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:9000/member/${userId}`, {
        name: formData.name,
        phone: formData.phone
      });

      if (response.data.success) {
        toast.success("회원 정보가 수정되었습니다.");
        setIsEditing(false);
        // 회원 목록 새로고침
        dispatch(fetchAllMembers());
        // 개요 섹션으로 전환
        setCurrentSection("overview");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      toast.error("회원 정보 수정 중 오류가 발생했습니다.");
    }
  };

  // 회원 탈퇴 처리
  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`http://localhost:9000/member/${userId}`);
      
      if (response.data.success) {
        toast.success("회원 탈퇴가 완료되었습니다.");
        dispatch(getLogout());
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      toast.error("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 transition bg-white border border-gray-100 shadow-xl rounded-3xl">
        <div className="flex items-center justify-center">
          <p>회원 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6 transition bg-white border border-gray-100 shadow-xl rounded-3xl">
        <div className="flex items-center justify-center">
          <p>회원 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 transition bg-white border border-gray-100 shadow-xl rounded-3xl hover:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">회원 설정</h2>
        <button
          onClick={toggleEditMode}
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          {isEditing ? "취소" : "수정"}
        </button>
      </div>
      
      {message && (
        <div className={`p-2 mb-4 rounded-md ${message.includes("성공") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">이름</label>
          <input
            type="text"
            name="name"
            className={`w-full px-4 py-2 border rounded-md ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""} ${nameError ? "border-red-500" : ""}`}
            value={formData.name}
            onChange={handleChange}
            onBlur={handleNameBlur}
            readOnly={!isEditing}
          />
          {nameError && <p className="mt-1 text-sm text-red-500">이름은 한글만 입력 가능합니다.</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">휴대폰 번호</label>
          <input
            type="tel"
            name="phone"
            className={`w-full px-4 py-2 border rounded-md ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
            value={formData.phone}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">아이디</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-100 border rounded-md cursor-not-allowed"
            defaultValue={currentUser.ID}
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">이메일</label>
          <input
            type="email"
            className="w-full px-4 py-2 bg-gray-100 border rounded-md cursor-not-allowed"
            defaultValue={`${currentUser.EMAILNAME}@${currentUser.EMAILDOMAIN}`}
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">회원 등급</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-100 border rounded-md cursor-not-allowed"
            defaultValue={currentUser.GRADE}
            readOnly
          />
        </div>
        {isEditing && (
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white rounded-md ${
              !formData.name || !formData.phone || formData.phone.length !== 11 || nameError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={!formData.name || !formData.phone || formData.phone.length !== 11 || nameError}
          >
            저장
          </button>
        )}
      </form>
      <CancleBtn text="탈퇴" onClick={handleDeleteUser} />
    </div>
  );
}
