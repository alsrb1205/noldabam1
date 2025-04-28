import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import SignupInputField from "./SignupInputField.jsx";

export default function EmailStep({ nextStep, prevStep }) {
  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();
  const emailLocal = watch("emailLocal");
  const emailDomain = watch("emailDomain");
  const [loading, setLoading] = useState(false);
  const [validMessage, setValidMessage] = useState("");
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (emailLocal && emailDomain) {
      const isValidLocal = /^[A-Za-z0-9._%+-]+$/.test(emailLocal);
      if (isValidLocal) {
        setValidMessage("올바른 이메일 형식입니다");
      } else {
        setValidMessage("");
      }
    } else {
      setValidMessage("");
    }
  }, [emailLocal, emailDomain]);

  // 컴포넌트가 마운트될 때 이메일 입력 필드에 포커스
  useEffect(() => {
    const emailInput = document.querySelector('input[name="emailLocal"]');
    if (emailInput) {
      setTimeout(() => {
        emailInput.focus();
      }, 0);
    }
  }, []);

  const checkEmail = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:9000/member/emailcheck",
        {
          email: `${emailLocal}@${emailDomain}`,
        },
        {
          timeout: 15000,
        }
      );
      if (res.data.result === 1) {
        toast.warn("이미 사용 중인 이메일입니다");
        setValidMessage("");
      } else {
        toast.success("사용 가능한 이메일입니다");
        setValidMessage("사용 가능한 이메일입니다");
        nextStep();
      }
    } catch (err) {
      toast.error("이메일 확인 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const onNext = async () => {
    const valid = await trigger(["emailLocal", "emailDomain"]);
    if (valid) checkEmail();
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (emailLocal && emailDomain) {
        const valid = await trigger(["emailLocal", "emailDomain"]);
        if (valid) checkEmail();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <SignupInputField
          {...register("emailLocal", {
            required: "이메일을 입력해주세요",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+$/,
              message: "영문, 숫자, 특수문자(._%-+)만 사용 가능합니다",
            },
          })}
          label="이메일을 입력해주세요"
          type="text"
          name="emailLocal"
          error={errors.emailLocal?.message}
          validMessage={validMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const domainSelect = document.querySelector(
                'select[name="emailDomain"]'
              );
              if (domainSelect) {
                domainSelect.focus();
              }
            }
          }}
          autoFocus
        />
        <span>@</span>
        <select
          {...register("emailDomain", {
            required: "도메인을 선택해주세요",
          })}
          className="w-[40%] px-2 py-2 border-b focus:outline-none"
          defaultValue=""
          onKeyDown={handleKeyDown}
        >
          <option value="" disabled>
            선택
          </option>
          <option value="naver.com">naver.com</option>
          <option value="gmail.com">gmail.com</option>
          <option value="kakao.com">kakao.com</option>
        </select>
      </div>
      {errors.emailDomain && (
        <p className="text-sm text-red-500">{errors.emailDomain.message}</p>
      )}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={prevStep}
          className="text-sm text-gray-500"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md disabled:opacity-60"
        >
          {loading ? `확인 중${dots}` : "다음"}
        </button>
      </div>
    </div>
  );
}
