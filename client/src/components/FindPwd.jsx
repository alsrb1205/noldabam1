import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MoveLogin from "./signup/MoveLogin.jsx";
import SignupInputField from "./signup/SignupInputField.jsx";
import { openLoginModal } from "../features/modal/modalSlice.js";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function FindPwd() {
  const dispatch = useDispatch();

  // 아이디 입력값을 관리하는 상태
  const [username, setUsername] = useState("");
  // 이메일 입력값을 관리하는 상태
  const [email, setEmail] = useState("");
  // 인증 코드 입력값을 관리하는 상태
  const [code, setCode] = useState("");
  // 현재 단계를 관리하는 상태 ("id": 아이디 입력, "email": 이메일 입력, "verify": 인증 코드 입력, "reset": 비밀번호 재설정)
  const [step, setStep] = useState("id");
  // 아이디 유효성 검사 상태
  const [usernameValid, setUsernameValid] = useState(false);
  // 이메일 유효성 검사 상태
  const [emailValid, setEmailValid] = useState(false);
  // 이메일 유효성 메시지
  const [emailValidMessage, setEmailValidMessage] = useState("");
  // 타이머 상태 (초 단위)
  const [timeLeft, setTimeLeft] = useState(180);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 새 비밀번호 입력값
  const [newPassword, setNewPassword] = useState("");
  // 새 비밀번호 확인 입력값
  const [confirmPassword, setConfirmPassword] = useState("");
  // 비밀번호 유효성 검사 상태
  const [passwordValid, setPasswordValid] = useState(false);
  // 비밀번호 일치 여부
  const [passwordMatch, setPasswordMatch] = useState(false);
  // 새 비밀번호 표시 여부
  const [showNewPassword, setShowNewPassword] = useState(false);
  // 새 비밀번호 확인 표시 여부
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // 플로팅 메시지 상태
  const [floatingMessage, setFloatingMessage] = useState("");

  // 타이머 효과
  useEffect(() => {
    let timer;
    if (step === "verify" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, timeLeft]);

  // 남은 시간을 분:초 형식으로 변환
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // 아이디 입력값이 변경될 때 유효성 검사
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    // 아이디 형식 검사
    if (value && /^[A-Za-z0-9]{6,12}$/.test(value)) {
      setUsernameValid(true);
    } else {
      setUsernameValid(false);
    }
  };

  // 이메일 입력값이 변경될 때 유효성 검사
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // 이메일 형식 검사
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (value && emailRegex.test(value)) {
      setEmailValid(true);
      setEmailValidMessage("올바른 이메일 형식입니다");
    } else {
      setEmailValid(false);
      setEmailValidMessage("");
    }
  };

  // 인증번호 입력값이 변경될 때 빈칸 제거
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\s/g, "");
    setCode(value);
  };

  // 새 비밀번호 입력값이 변경될 때 유효성 검사
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    // 비밀번호 형식 검사
    if (
      value &&
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,20}$/.test(
        value
      )
    ) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }

    // 비밀번호 일치 여부 검사
    if (value && confirmPassword && value === confirmPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  // 비밀번호 확인 입력값이 변경될 때 일치 여부 검사
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // 비밀번호 일치 여부 검사
    if (value && newPassword && value === newPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  // 이메일 마스킹 함수
  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    let maskedUsername;
    if (username.length <= 3) {
      // 3자 이하인 경우 첫 글자만 보이고 나머지는 *
      maskedUsername = username.charAt(0) + "*".repeat(username.length - 1);
    } else {
      // 3자 초과인 경우 첫 2자와 마지막 1자만 보이고 나머지는 *
      maskedUsername =
        username.substring(0, 2) +
        "*".repeat(username.length - 3) +
        username.charAt(username.length - 1);
    }
    return `${maskedUsername}@${domain}`;
  };

  // 아이디 확인 함수
  const handleCheckUsername = async (e) => {
    e.preventDefault();

    if (!usernameValid) {
      setFloatingMessage("올바른 아이디 형식을 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:9000/member/idcheck", {
        id: username,
      });

      if (res.data.result === 1) {
        // 아이디가 존재하면 이메일 정보 가져오기
        const emailRes = await axios.post(
          "http://localhost:9000/member/get-email",
          {
            id: username,
          }
        );

        if (emailRes.data.success) {
          setEmail(emailRes.data.fullEmail);
          setEmailValid(true);
          setEmailValidMessage("이메일이 확인되었습니다");
          toast.success("아이디가 확인되었습니다");
          setStep("email");
        }
      } else {
        setFloatingMessage("존재하지 않는 아이디입니다");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "아이디 확인 중 오류가 발생했습니다";
      setFloatingMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일로 인증 코드를 전송하는 함수
  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!emailValid) {
      setFloatingMessage("올바른 이메일 형식을 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:9000/member/send-code", {
        email,
        id: username,
      });
      if (res.data.success) {
        toast.success("인증번호를 이메일로 보냈습니다.");
        setStep("verify");
        setTimeLeft(180); // 타이머 재설정
      }
    } catch (error) {
      // 서버에서 반환하는 에러 메시지 처리
      if (error.response?.status === 404) {
        setFloatingMessage("가입 이력이 없는 이메일 입니다.");
      } else {
        const message = error.response?.data?.message || "인증번호 전송 실패";
        setFloatingMessage(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 입력된 인증 코드를 검증하고 비밀번호 재설정 단계로 이동하는 함수
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (timeLeft === 0) {
      setFloatingMessage("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      setStep("email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:9000/member/verify-code", {
        email,
        code,
        id: username,
      });
      if (res.data.success) {
        toast.success("인증 완료!");
        setStep("reset");
      } else {
        setFloatingMessage(res.data.message || "인증 실패");
      }
    } catch (error) {
      const message = error.response?.data?.message || "서버 오류 발생";
      setFloatingMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 재전송 핸들러
  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:9000/member/send-code", {
        email,
        id: username,
      });
      if (res.data.success) {
        toast.success("인증번호를 재전송했습니다.");
        setTimeLeft(180); // 타이머 재설정
      }
    } catch (error) {
      const message = error.response?.data?.message || "인증번호 재전송 실패";
      setFloatingMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 재설정 함수
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      setFloatingMessage("올바른 비밀번호 형식을 입력해주세요");
      return;
    }

    if (!passwordMatch) {
      setFloatingMessage("비밀번호가 일치하지 않습니다");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:9000/member/reset-password",
        {
          id: username,
          email,
          code,
          newPassword,
        }
      );
      if (res.data.success) {
        toast.success("비밀번호가 재설정되었습니다");
        // 로그인 페이지로 이동
        setTimeout(() => {
          dispatch(openLoginModal());
        }, 1500);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setFloatingMessage("현재 사용 중인 비밀번호는 사용할 수 없습니다");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordValid(false);
        setPasswordMatch(false);
      } else {
        const message = error.response?.data?.message || "서버 오류 발생";
        setFloatingMessage(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <h2 className="text-gray-400 text-[14px] mt-[10px]">
        {step === "id" && "회원가입 시 등록한 아이디를 입력해 주세요."}
        {step === "email" && "회원가입 시 등록한 이메일 주소를 확인해 주세요."}
        {step === "verify" && "이메일로 전송된 인증번호를 입력해 주세요."}
      </h2>

      <form
        onSubmit={
          step === "id"
            ? handleCheckUsername
            : step === "email"
            ? handleSendCode
            : step === "verify"
            ? handleVerifyCode
            : handleResetPassword
        }
        className="flex flex-col"
      >
        {step === "id" && (
          <SignupInputField
            label="아이디를 입력해주세요"
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            error={
              username && !usernameValid
                ? "올바른 아이디 형식을 입력해주세요"
                : floatingMessage
            }
            validMessage={usernameValid ? "올바른 아이디 형식입니다" : ""}
          />
        )}

        {step === "email" && (
          <div>
            <SignupInputField
              label="가입 시 등록한 이메일 주소입니다"
              type="text"
              name="email"
              value={maskEmail(email)}
              onChange={handleEmailChange}
              error={
                email && !emailValid
                  ? "올바른 이메일 형식을 입력해주세요"
                  : floatingMessage
              }
              validMessage={emailValid ? emailValidMessage : ""}
            />
          </div>
        )}

        {step === "verify" && (
          <div className="relative">
            <SignupInputField
              label="인증번호를 입력해주세요"
              type="text"
              name="code"
              value={code}
              onChange={handleCodeChange}
              error={floatingMessage}
              validMessage={
                timeLeft > 0
                  ? `남은 시간: ${formatTime(timeLeft)}`
                  : "인증 시간이 만료되었습니다"
              }
            />
            {timeLeft === 0 && (
              <button
                type="button"
                onClick={handleResendCode}
                className="absolute right-0 top-[20px] text-blue-600 text-sm hover:text-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "전송 중..." : "재전송"}
              </button>
            )}
          </div>
        )}

        {step === "reset" && (
          <>
            <div className="relative">
              <SignupInputField
                label="새 비밀번호를 입력해주세요"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                error={
                  newPassword && !passwordValid
                    ? "영문, 숫자, 특수문자 포함 10~20자로 입력해주세요"
                    : floatingMessage
                }
                validMessage={passwordValid ? "사용 가능한 비밀번호입니다" : ""}
              />
            </div>
            <div className="relative">
              <SignupInputField
                label="비밀번호를 다시 입력해주세요"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={
                  confirmPassword && !passwordMatch
                    ? "비밀번호가 일치하지 않습니다"
                    : floatingMessage
                }
                validMessage={passwordMatch ? "비밀번호가 일치합니다" : ""}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full mt-[20px] py-2.5 px-6 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
            isLoading
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading
            ? "처리 중..."
            : step === "id"
            ? "다음"
            : step === "email"
            ? "인증번호 받기"
            : step === "verify"
            ? "인증하기"
            : "비밀번호 재설정"}
        </button>
      </form>
      <MoveLogin />
    </div>
  );
}
