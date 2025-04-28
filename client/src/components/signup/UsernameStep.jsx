// steps/UsernameStep.jsx
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import MoveLogin from "./MoveLogin.jsx";
import SignupInputField from "./SignupInputField.jsx";

export default function UsernameStep({ nextStep }) {
  const {
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [loading, setLoading] = useState(false);
  const [validMessage, setValidMessage] = useState("");
  const [dots, setDots] = useState(".");
  const [isIdChecked, setIsIdChecked] = useState(false);
  const username = watch("username");

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (username && /^[A-Za-z0-9]{6,12}$/.test(username)) {
      setValidMessage("올바른 형식의 아이디입니다");
    } else {
      setValidMessage("");
      setIsIdChecked(false);
    }
  }, [username]);

  const checkId = async () => {
    if (!username) {
      setValidMessage("아이디를 입력해주세요");
      return;
    }

    if (!/^[A-Za-z0-9]{6,12}$/.test(username)) {
      setValidMessage("영문+숫자 조합 6~12자로 입력해주세요");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:9000/member/idcheck",
        {
          id: username,
        },
        {
          timeout: 15000,
        }
      );
      if (res.data.result === 1) {
        setValidMessage("이미 사용 중인 아이디입니다");
        setIsIdChecked(false);
        // 입력 필드 초기화
        setValue("username", "");
        // 입력 필드에 포커스
        setTimeout(() => {
          const usernameInput = document.querySelector(
            'input[name="username"]'
          );
          if (usernameInput) {
            usernameInput.focus();
          }
        }, 0);
      } else {
        setValidMessage("사용 가능한 아이디입니다");
        setIsIdChecked(true);
      }
    } catch (err) {
      setValidMessage("중복 확인 중 오류가 발생했습니다");
      setIsIdChecked(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SignupInputField
          {...register("username", {
            required: "아이디를 입력해주세요",
            pattern: {
              value: /^[A-Za-z0-9]{6,12}$/,
              message: "영문+숫자 조합 6~12자",
            },
          })}
          label="아이디"
          type="text"
          name="username"
          error={errors.username?.message}
          validMessage={validMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (username && /^[A-Za-z0-9]{6,12}$/.test(username)) {
                if (isIdChecked) {
                  nextStep();
                } else {
                  checkId();
                }
              }
            }
          }}
          autoFocus
        />
        <button
          type="button"
          onClick={checkId}
          disabled={
            loading || !username || !/^[A-Za-z0-9]{6,12}$/.test(username)
          }
          className="absolute right-0 px-3 py-1 text-xs text-gray-600 -translate-y-1/2 rounded top-1/2 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? `확인 중${dots}` : "중복 확인"}
        </button>
      </div>

      <button
        type="button"
        onClick={nextStep}
        disabled={!isIdChecked}
        className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        다음
      </button>

      <MoveLogin />
    </div>
  );
}
