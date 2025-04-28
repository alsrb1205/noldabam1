import { toast } from "react-toastify";

/********************************************
    title : 유효성체크 안되면 탭 이동 막기
*********************************************/
export const handleKeyDown = (e, name, ref) => {
  if (e.key === "Tab") {
    const isValid = validateSingleField(name, ref);
    if (!isValid) {
      e.preventDefault(); // 유효하지 않으면 다음 필드로 포커스 안 넘어감
    }
  }
};

/********************************************
    title : 로그인 폼 체크(탭할때 유효성체크)
*********************************************/
export const validateSingleField = (name, ref) => {
  const value = ref.current?.value?.trim();

  if (name === "id") {
    if (value === "") {
      return { isValid: false, message: "아이디를 입력해주세요", color: "red" };
    }
    return {
      isValid: true,
      message: "올바른 아이디 형식입니다",
      color: "green",
    };
  }

  if (name === "pwd") {
    if (value === "") {
      return {
        isValid: false,
        message: "비밀번호를 입력해주세요",
        color: "red",
      };
    }
    return {
      isValid: true,
      message: "올바른 비밀번호 형식입니다",
      color: "green",
    };
  }

  return { isValid: true, message: "", color: "" };
};

/*************************
    title : 로그인 폼 체크
**************************/
export const validateLogin = ({ idRef, pwdRef }, formData) => {
  if (!formData.id || formData.id.trim() === "") {
    return {
      isValid: false,
      message: "아이디를 입력해주세요",
      color: "red",
      field: "id",
    };
  }
  if (!formData.pwd || formData.pwd.trim() === "") {
    return {
      isValid: false,
      message: "비밀번호를 입력해주세요",
      color: "red",
      field: "pwd",
    };
  }
  return { isValid: true, message: "", color: "", field: "" };
};
