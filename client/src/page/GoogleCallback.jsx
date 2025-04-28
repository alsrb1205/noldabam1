import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { googleLoginFlow } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { closeLoginModal } from "../features/modal/modalSlice";

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alreadyCalled = useRef(false);

  useEffect(() => {
    if (alreadyCalled.current) return;
    alreadyCalled.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      dispatch(googleLoginFlow({ code }))
        .then(() => {
          navigate("/");
          dispatch(closeLoginModal());
        })
        .catch((error) => {
          console.error("구글 로그인 에러:", error);
          navigate("/");
        });
    }
  }, []);

  return <div>구글 로그인 처리 중...</div>;
}
