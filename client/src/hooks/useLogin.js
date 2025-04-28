import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeLoginModal } from "../features/modal/modalSlice.js";
import { getLoginReset } from "../services/authApi.js";
import { toast } from "react-toastify";

export function useLogin() {
  const dispatch = useDispatch();
  const isLoginOpen = useSelector((state) => state.modal.isLoginModalOpen);
  const modalType = useSelector((state) => state.modal.modalType);
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const isError = useSelector((state) => state.login.isError);
  const justLoggedIn = useSelector((state) => state.login.justLoggedIn);
  const [formData, setFormData] = useState({ id: "", pwd: "" });
  const [saveId, setSaveId] = useState(false);

  const refs = {
    idRef: useRef(null),
    pwdRef: useRef(null),
  };

  // 로그인 실패시 리셋
  useEffect(() => {
    if (isError) {
      toast.warn("아이디 또는 비밀번호가 일치하지 않습니다.");
      setFormData({ id: "", pwd: "" });
      refs.idRef.current?.focus();

      // ✅ 다음 렌더 후 리셋
      setTimeout(() => {
        dispatch(getLoginReset());
      }, 0);
    }
  }, [isError]);

  // 로그인 성공하면 모달 닫고 로그인 리셋
  useEffect(() => {
    if (isLoggedIn && justLoggedIn) {
      toast.success("로그인 성공!");
      dispatch(closeLoginModal());
      dispatch(getLoginReset());
    }
  }, [isLoggedIn, justLoggedIn]);

  useEffect(() => {
    const savedId = localStorage.getItem("savedUserId");
    if (savedId) {
      setSaveId(true);
      setFormData({ id: savedId, pwd: "" }); // pwd 초기화
    } else {
      setSaveId(false);
      setFormData({ id: "", pwd: "" }); //  전체 초기화
    }
  }, [isLoginOpen]);

  return {
    isLoginOpen,
    modalType,
    isLoggedIn,
    isError,
    justLoggedIn,
    formData,
    setFormData,
    refs,
    saveId,
    setSaveId,
  };
}
