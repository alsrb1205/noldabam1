import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import SignupInputField from "./SignupInputField.jsx";

export default function NameStep({ nextStep, prevStep }) {
  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  const name = watch("name");
  const nameValid = name && /^[가-힣]+$/.test(name);

  // 컴포넌트가 마운트될 때 이름 입력 필드에 포커스
  useEffect(() => {
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput) {
      setTimeout(() => {
        nameInput.focus();
      }, 0);
    }
  }, []);

  const onNext = async () => {
    const valid = await trigger("name");
    if (valid) {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <SignupInputField
        {...register("name", {
          required: "이름을 입력해주세요",
          pattern: {
            value: /^[가-힣]+$/,
            message: "한글만 입력 가능합니다",
          },
        })}
        label="이름을 입력해주세요"
        type="text"
        name="name"
        error={errors.name?.message}
        validMessage={!errors.name && nameValid ? "올바른 이름입니다" : ""}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && nameValid) {
            e.preventDefault();
            const valid = await trigger("name");
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
