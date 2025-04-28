import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import SignupInputField from "./SignupInputField.jsx";

export default function PhoneStep({ nextStep, prevStep }) {
  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  const phone = watch("phone");
  const phoneValid = phone && /^01[016789]\d{7,8}$/.test(phone);

  // 컴포넌트가 마운트될 때 전화번호 입력 필드에 포커스
  useEffect(() => {
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
      setTimeout(() => {
        phoneInput.focus();
      }, 0);
    }
  }, []);

  const onNext = async () => {
    const valid = await trigger("phone");
    if (valid) {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <SignupInputField
        {...register("phone", {
          required: "전화번호를 입력해주세요",
          pattern: {
            value: /^01[016789]\d{7,8}$/,
            message: "하이픈 없이 숫자만 입력해주세요 (예: 01012345678)",
          },
        })}
        label="휴대폰 번호를 입력해주세요"
        type="tel"
        name="phone"
        error={errors.phone?.message}
        validMessage={
          !errors.phone && phoneValid ? "올바른 전화번호입니다" : ""
        }
        onKeyDown={async (e) => {
          if (e.key === "Enter" && phoneValid) {
            e.preventDefault();
            const valid = await trigger("phone");
            if (valid) {
              nextStep();
            }
          }
        }}
        autoFocus
      />

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
          className="px-4 py-2 text-white bg-blue-600 rounded-md"
        >
          다음
        </button>
      </div>
    </div>
  );
}
