import React, { useState, useEffect } from "react";
import axios from "axios";
import MoveLogin from "./signup/MoveLogin.jsx";
import SignupInputField from "./signup/SignupInputField.jsx";

// 아이디 찾기 기능을 제공하는 컴포넌트
export default function FindId() {
  // 이메일 입력값을 관리하는 상태
  const [email, setEmail] = useState("");
  // 인증 코드 입력값을 관리하는 상태
  const [code, setCode] = useState("");
  // 현재 단계를 관리하는 상태 ("send": 이메일 입력, "verify": 인증 코드 입력)
  const [step, setStep] = useState("send");
  // 찾은 사용자 ID를 저장하는 상태
  const [userId, setUserId] = useState(null);
  // 이메일 유효성 검사 상태
  const [emailValid, setEmailValid] = useState(false);
  // 이메일 유효성 메시지
  const [emailValidMessage, setEmailValidMessage] = useState("");
  // 타이머 상태 (초 단위)
  const [timeLeft, setTimeLeft] = useState(180);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
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
      });
      if (res.data.success) {
        setFloatingMessage("인증번호를 이메일로 보냈습니다.");
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

  // 입력된 인증 코드를 검증하고 아이디를 찾는 함수
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (timeLeft === 0) {
      setFloatingMessage("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      setStep("send");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:9000/member/verify-code", {
        email,
        code,
      });
      if (res.data.success) {
        setUserId(res.data.userId);
        setFloatingMessage("인증 완료!");
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
      });
      if (res.data.success) {
        setFloatingMessage("인증번호를 재전송했습니다.");
        setTimeLeft(180); // 타이머 재설정
      }
    } catch (error) {
      const message = error.response?.data?.message || "인증번호 재전송 실패";
      setFloatingMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {/* 아이디 찾기 결과가 있을 경우 표시 */}
      {userId ? (
        <div className="text-[18px] text-center font-bold mt-[20px]">
          <p>해당 이메일의 아이디는</p>
          <p className="mt-2 text-[#1473e6]">{userId}</p>
        </div>
      ) : (
        // 아이디 찾기 폼
        <>
          <h2 className="text-gray-400 text-[14px] mt-[10px]">
            회원가입 시 등록한 이메일 주소를 입력해 주세요.
          </h2>
          <form
            onSubmit={step === "send" ? handleSendCode : handleVerifyCode}
            className="flex flex-col"
          >
            <SignupInputField
              label="이메일을 입력해주세요"
              type="text"
              name="email"
              value={email}
              onChange={handleEmailChange}
              error={
                email && !emailValid
                  ? "올바른 이메일 형식을 입력해주세요"
                  : floatingMessage === "가입 이력이 없는 이메일 입니다."
                  ? floatingMessage
                  : ""
              }
              validMessage={emailValid ? emailValidMessage : ""}
            />

            {/* 인증 코드 입력 단계일 때만 표시되는 입력 필드 */}
            {step === "verify" && (
              <div className="relative">
                <SignupInputField
                  label="인증번호를 입력해주세요"
                  type="text"
                  name="code"
                  value={code}
                  onChange={handleCodeChange}
                  validMessage={
                    timeLeft > 0
                      ? `남은 시간: ${formatTime(timeLeft)}`
                      : "인증 시간이 만료되었습니다"
                  }
                  error={timeLeft === 0 ? "인증 시간이 만료되었습니다" : ""}
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

            <button
              type="submit"
              className={`w-full mt-[20px] py-2.5 px-6 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
                isLoading
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={(step === "verify" && timeLeft === 0) || isLoading}
            >
              {isLoading
                ? "처리 중..."
                : step === "send"
                ? "인증번호 받기"
                : "아이디 찾기"}
            </button>
          </form>
        </>
      )}
      <MoveLogin />
    </div>
  );
}
