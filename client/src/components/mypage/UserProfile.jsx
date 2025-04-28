import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMembers } from "../../services/authApi.js";
import { setInitialLoginState } from "../../features/auth/authSlice.js";

export default function UserProfile() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // localStorage 에서 user_id 가져오기 (로그인 방식과 무관하게 식별자 저장됨)
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
        dispatch(fetchAllMembers());
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

  if (isLoading) {
    return (
      <div className="p-6 transition bg-white border border-gray-100 shadow-xl rounded-3xl">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
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
    <div className="p-6 transition bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 mb-1 text-xl font-bold">
            {currentUser.NAME || "회원"}님의 프로필
          </h2>
          <p className="text-sm text-gray-500">
            이메일: {`${currentUser.EMAILNAME}@${currentUser.EMAILDOMAIN}`}
          </p>
          <p className="mt-1 text-sm font-medium text-yellow-500">
            회원 등급: {currentUser.GRADE || "등급 정보 없음"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            가입일:{" "}
            {currentUser.MDATE
              ? new Date(currentUser.MDATE).toLocaleDateString()
              : "정보 없음"}
          </p>
        </div>
      </div>
    </div>
  );
}
