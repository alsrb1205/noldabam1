// pages/KakaoCallback.jsx
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { kakaoLoginFlow } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { closeLoginModal } from "../features/modal/modalSlice.js";

export default function KakaoCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alreadyCalled = useRef(false);

  useEffect(() => {
    if (alreadyCalled.current) return;
    alreadyCalled.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      dispatch(kakaoLoginFlow({ code }))
        .then(() => {
          navigate("/");
          dispatch(closeLoginModal());
        })
        .catch((error) => {
          console.error("카카오 로그인 에러:", error);
          navigate("/");
        });
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}
