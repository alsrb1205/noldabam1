import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import SignupInputField from "./SignupInputField.jsx";

export default function PasswordStep({ nextStep, prevStep }) {
  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // 컴포넌트가 마운트될 때 비밀번호 입력 필드에 포커스
  useEffect(() => {
    const passwordInput = document.querySelector('input[name="password"]');
    if (passwordInput) {
      setTimeout(() => {
        passwordInput.focus();
      }, 0);
    }
  }, []);

  const onNext = async () => {
    const valid = await trigger(["password", "confirmPassword"]);
    if (valid) {
      nextStep();
    }
  };

  const passwordValid =
    password &&
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,20}$/.test(
      password
    );
  const passwordMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="flex flex-col gap-4">
      <SignupInputField
        {...register("password", {
          required: "비밀번호를 입력해주세요",
          pattern: {
            value:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,20}$/,
            message: "영문, 숫자, 특수문자 포함 10~20자",
          },
        })}
        label="비밀번호를 입력해주세요"
        type="password"
        name="password"
        error={errors.password?.message}
        validMessage={
          !errors.password && passwordValid ? "사용 가능한 비밀번호입니다" : ""
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" && passwordValid) {
            e.preventDefault();
            document.querySelector('input[name="confirmPassword"]').focus();
          }
        }}
        autoFocus
      />

      <SignupInputField
        {...register("confirmPassword", {
          required: "비밀번호 확인을 입력해주세요",
          validate: (value) =>
            value === password || "비밀번호가 일치하지 않습니다",
        })}
        label="비밀번호 다시 입력해주세요"
        type="password"
        name="confirmPassword"
        error={errors.confirmPassword?.message}
        validMessage={
          !errors.confirmPassword && passwordMatch
            ? "비밀번호가 일치합니다"
            : ""
        }
        onKeyDown={async (e) => {
          if (e.key === "Enter" && passwordMatch) {
            e.preventDefault();
            const valid = await trigger(["password", "confirmPassword"]);
            if (valid) {
              nextStep();
            }
          }
        }}
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
