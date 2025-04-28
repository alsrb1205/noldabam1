import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogin } from "../../services/authApi.js";
import {
  setRecaptchaToken,
  resetRecaptchaToken,
} from "../../features/auth/authSlice";
import {
  validateLogin,
  validateSingleField,
  handleKeyDown,
} from "../../utils/funcValidate.js";
import LoginInputField from "./LoginInputField.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import {
  openFindIdModal,
  openFindPwdModal,
  openSignupModal,
} from "../../features/modal/modalSlice.js";

// icons
import { SiNaver } from "react-icons/si";
import { FaGoogle } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function LoginForm({
  formData,
  setFormData,
  refs,
  saveId,
  setSaveId,
}) {
  const dispatch = useDispatch();
  const recaptchaRef = useRef();
  const recaptchaToken = useSelector((state) => state.login.recaptchaToken);
  const [step, setStep] = useState(1);
  const recaptchaTimeoutRef = useRef(null);

  // reCAPTCHA 자동 갱신 함수
  const refreshRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      recaptchaRef.current.execute();
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (recaptchaTimeoutRef.current) {
        clearTimeout(recaptchaTimeoutRef.current);
      }
    };
  }, []);

  // reCAPTCHA 토큰 설정 시 자동 갱신 타이머 설정
  useEffect(() => {
    if (recaptchaToken) {
      // 1분 30초 후에 자동 갱신 (2분 만료 전에 갱신)
      recaptchaTimeoutRef.current = setTimeout(() => {
        refreshRecaptcha();
      }, 90000);
    }
    return () => {
      if (recaptchaTimeoutRef.current) {
        clearTimeout(recaptchaTimeoutRef.current);
      }
    };
  }, [recaptchaToken]);

  // 네이버 로그인 API
  const handleNaverLogin = () => {
    // reCAPTCHA 상태 초기화
    dispatch(resetRecaptchaToken());
    if (recaptchaTimeoutRef.current) {
      clearTimeout(recaptchaTimeoutRef.current);
    }
    
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;
    const state = Math.random().toString(36).substring(2, 15);
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=${state}&auth_type=reauthenticate`;
    window.open(url, "_self");
  };

  // 카카오 로그인 API
  const handleKakaoLogin = () => {
    // reCAPTCHA 상태 초기화
    dispatch(resetRecaptchaToken());
    if (recaptchaTimeoutRef.current) {
      clearTimeout(recaptchaTimeoutRef.current);
    }
    
    const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      KAKAO_REDIRECT_URI
    )}&prompt=login`;
    window.open(url, "_self");
  };

  // 구글 로그인 API
  const handleGoogleLogin = () => {
    // reCAPTCHA 상태 초기화
    dispatch(resetRecaptchaToken());
    if (recaptchaTimeoutRef.current) {
      clearTimeout(recaptchaTimeoutRef.current);
    }
    
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      GOOGLE_REDIRECT_URI
    )}&response_type=code&scope=email%20profile&prompt=consent&access_type=offline`;
    window.open(url, "_self");
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (validateLogin(refs, formData)) {
      // 비밀번호가 입력되었을 때만 reCAPTCHA 검증
      if (formData.pwd && !recaptchaToken) {
        toast.warn("reCAPTCHA 인증이 필요합니다.");
        return;
      }

      if (saveId) {
        localStorage.setItem("savedUserId", formData.id);
      } else {
        localStorage.removeItem("savedUserId");
      }

      try {
        const loginSuccess = await dispatch(
          getLogin({ ...formData, recaptchaToken })
        );

        if (loginSuccess === true) {
          console.log("Login truly successful");
        } else {
          console.error(
            "Login failed (API Error or caught exception in thunk)"
          );
          dispatch(resetRecaptchaToken());
          // 로그인 실패 시 아이디 입력 필드로 포커스 이동
          setStep(1);
          setTimeout(() => {
            refs.idRef.current?.focus();
          }, 0);
        }
      } catch (error) {
        // dispatch 호출 자체의 오류 또는 예상치 못한 오류 (thunk 외부의 에러)
        console.error("로그인 처리 중 예상치 못한 외부 오류:", error);
        toast.error(
          "로그인 처리 중 예기치 않은 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
        dispatch(resetRecaptchaToken());
        // 로그인 실패 시 아이디 입력 필드로 포커스 이동
        setStep(1);
        setTimeout(() => {
          refs.idRef.current?.focus();
        }, 0);
      }
    }
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
    // 비밀번호 입력 필드에 포커스
    setTimeout(() => {
      refs.pwdRef.current?.focus();
    }, 0);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex flex-col items-center">
      {/* 로고 */}
      <img
        src="/images/logo/logo1.png"
        alt="놀다밤 로고"
        className="w-[150px] mb-4"
      />

      {/* 타이틀 */}
      {/* <h1 className="mb-2 text-2xl font-medium">로그인</h1> */}
      <p className="mb-8 text-sm text-gray-600">
        놀다밤 서비스 이용을 위해 로그인해 주세요.
      </p>

      <form
        onSubmit={handleLoginSubmit}
        className="w-full max-w-[364px] relative"
      >
        <div className="flex flex-col gap-4">
          {step === 1 && (
            <>
              <div className="flex flex-col gap-2">
                <LoginInputField
                  label="아이디를 입력해주세요"
                  type="text"
                  name="id"
                  ref={refs.idRef}
                  onChange={handleChangeForm}
                  onBlur={() => validateSingleField("id", refs.idRef)}
                  onKeyDown={(e) => {
                    handleKeyDown(e, "id", refs.idRef);
                    if (e.key === "Enter" && formData.id) {
                      e.preventDefault();
                      nextStep();
                    }
                  }}
                  value={formData.id}
                />
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={saveId}
                      onChange={(e) => setSaveId(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">아이디 저장</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch(openFindIdModal())}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    아이디를 잊어버리셨습니까?
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-2.5 px-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.id}
              >
                계속하기
              </button>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-600">
                  아직 회원이 아니십니까?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(openSignupModal())}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  회원가입
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-2">
                <LoginInputField
                  label="비밀번호를 입력해주세요"
                  type="password"
                  name="pwd"
                  ref={refs.pwdRef}
                  onChange={handleChangeForm}
                  onBlur={() => validateSingleField("pwd", refs.pwdRef)}
                  onKeyDown={(e) => handleKeyDown(e, "pwd", refs.pwdRef)}
                  value={formData.pwd}
                />
                <div className="flex items-center justify-between px-1">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <span>←</span>
                    이전으로
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(openFindPwdModal())}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    비밀번호를 잊어버리셨습니까?
                  </button>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div
                className={`flex justify-center w-full ${
                  formData.pwd ? "" : "recaptcha-hidden"
                }`}
              >
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_CLIENT_KEY}
                  ref={recaptchaRef}
                  size="normal"
                  theme="light"
                  onChange={(token) => {
                    dispatch(setRecaptchaToken(token));
                  }}
                  onExpired={() => {
                    toast.info("인증이 만료되었습니다. 다시 인증해주세요.");
                    recaptchaRef.current?.reset();
                    dispatch(resetRecaptchaToken());
                    setTimeout(() => recaptchaRef.current?.execute(), 1000);
                  }}
                  onError={() => {
                    toast.error("reCAPTCHA 인증 중 오류가 발생했습니다.");
                    recaptchaRef.current?.reset();
                    dispatch(resetRecaptchaToken());
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.pwd}
              >
                로그인
              </button>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-600">
                  아직 회원이 아니십니까?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(openSignupModal())}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  회원가입
                </button>
              </div>
            </>
          )}

          {/* SNS 로그인 */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">또는</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleNaverLogin}
                className="bg-[#03c75a] w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90"
              >
                <SiNaver className="text-xl text-white" />
              </button>
              <button
                type="button"
                onClick={handleKakaoLogin}
                className="bg-[#FEE500] w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90"
              >
                <RiKakaoTalkFill className="text-2xl text-[#000000]" />
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="bg-[#4285F4] w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90"
              >
                <FaGoogle className="text-xl text-white" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
