import { forwardRef, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginInputField = forwardRef(
  ({ label, type, name, onChange, value, onBlur, onKeyDown }, ref) => {
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e) => {
      setHasValue(e.target.value.length > 0);
      onChange(e);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // formData에서 받은 value를 기반으로 초기 hasValue 설정
    useEffect(() => {
      if (value?.length > 0) {
        setHasValue(true);
      } else {
        setHasValue(false);
      }
    }, [value]);

    // 라벨 위치 결정 로직
    const getLabelPosition = () => {
      // 값이 있으면 항상 위로
      if (hasValue) {
        return "top-[-2px] text-[12px]";
      }
      // 포커스가 있으면 위로
      if (isFocused) {
        return "top-[-2px] text-[12px]";
      }
      // 그 외에는 아래로
      return "top-[12px] text-[16px]";
    };

    return (
      <div className="pb-[10px]">
        <div className="relative flex items-center gap-[10px] border-b border-airlime-border h-[60px]">
          <div className="relative w-full">
            <input
              id={name}
              type={type === "password" && showPassword ? "text" : type}
              name={name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (onKeyDown) {
                  onKeyDown(e);
                }
              }}
              ref={ref}
              value={value}
              placeholder=" "
              className="peer w-full pt-[12px] pb-[4px] text-[16px] outline-none bg-transparent"
            />
            <label
              htmlFor={name}
              className={`
                absolute left-0 transition-all duration-200
                ${
                  hasValue ? "top-[-2px] text-[12px]" : "top-[12px] text-[16px]"
                }
                ${hasValue ? "text-[#1473e6]" : "text-gray-400"}
                ${isFocused ? "top-[-2px] text-[12px] text-[#1473e6]" : ""}
              `}
            >
              {label}
            </label>
            {type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 text-gray-400 -translate-y-1/2 top-1/2 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default LoginInputField;
