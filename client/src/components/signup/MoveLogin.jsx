import React from "react";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../features/modal/modalSlice.js";

export default function MoveLogin() {
  const dispatch = useDispatch();

  return (
    <div className="text-center text-sm text-gray-600 mt-[20px]">
      로그인 페이지로 이동하시겠습니까?{" "}
      <button
        className="text-sm text-blue-600 hover:text-blue-800"
        onClick={() => dispatch(openLoginModal())}
      >
        로그인
      </button>
    </div>
  );
}
