import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { naverLoginFlow } from "../services/authApi.js";
import { useNavigate } from "react-router-dom";
import { closeLoginModal } from "../features/modal/modalSlice.js";

export default function NaverCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alreadyCalled = useRef(false); // ✅ 추가

  useEffect(() => {
    if (alreadyCalled.current) return; // ✅ 이미 호출했으면 return
    alreadyCalled.current = true; // ✅ 호출 플래그 세팅

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");


    if (code && state) {
      dispatch(naverLoginFlow({ code, state })).then(() => {
        navigate("/");
        dispatch(closeLoginModal());
      });
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}