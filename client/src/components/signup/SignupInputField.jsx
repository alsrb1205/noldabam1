import { forwardRef, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignupInputField = forwardRef(
  (
    {
      label,
      type,
      name,
      onChange,
      value,
      onBlur,
      onKeyDown,
      error,
      validMessage,
      autoFocus,
    },
    ref
  ) => {
    const [hasValue, setHasValue] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && onKeyDown) {
        e.preventDefault();
        onKeyDown(e);
      }
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

    // 포커스 처리
    useEffect(() => {
      if (autoFocus && ref?.current) {
        setTimeout(() => {
          ref.current.focus();
        }, 0);
      }
    }, [ref, autoFocus]);

    const getLabelColor = () => {
      if (error) return "text-red-500";
      if (validMessage) return "text-green-500";
      if (hasValue || isFocused) return "text-[#1473e6]";
      return "text-gray-400";
    };

    const getLabelText = () => {
      if (error) return error;
      if (validMessage) return validMessage;
      return label;
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
              onKeyDown={handleKeyDown}
              ref={ref}
              value={value}
              placeholder=" "
              className="peer w-full pt-[12px] pb-[4px] text-[16px] outline-none bg-transparent pr-[100px]"
            />
            <label
              htmlFor={name}
              className={`
                absolute left-0 transition-all duration-200
                ${
                  hasValue || error || validMessage || isFocused
                    ? "top-[-2px] text-[12px]"
                    : "top-[12px] text-[16px]"
                }
                ${getLabelColor()}
                peer-focus:top-[-2px] peer-focus:text-[12px]
              `}
            >
              {getLabelText()}
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

export default SignupInputField;
