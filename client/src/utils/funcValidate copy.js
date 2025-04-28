import axios from "axios";
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

  if (name === "id" && value === "") {
    toast.warn("아이디를 입력해주세요");
    return false;
  }

  if (name === "pwd" && value === "") {
    toast.warn("비밀번호를 입력해주세요");
    return false;
  }

  return true;
};

/*************************
    title : 로그인 폼 체크
**************************/
export const validateLogin = ({ idRef, pwdRef }) => {
  let result = true;

  if (idRef.current.value === "") {
    toast.warn("아이디를 입력해주세요");
    idRef.current.focus();
    result = false;
  } else if (pwdRef.current.value === "") {
    toast.warn("패스워드를 입력해주세요");
    pwdRef.current.focus();
    result = false;
  }
  return result;
};

/**
 * title : 회원가입 폼 체크
 */
export const validateSignup = (refs, msgRefs, formData) => {
  const refEntries = Object.entries(refs.current);
  const msgRefEntries = Object.entries(msgRefs.current);

  //refEntries 배열객체와 msgRefEntries 배열객체의 인덱스를 동일하게 체크한다!!
  for (let i = 0; i < refEntries.length; i++) {
    const item = refEntries[i];
    const name = item[0];
    const ref = item[1]; // 데이터 입력폼 객체 주소

    let msgItem,
      msgName,
      msgRef = null;

    if (i < refEntries.length - 1) {
      msgItem = msgRefEntries[i];
      msgName = msgItem[0];
      msgRef = msgItem[1]; // 데이터 입력폼의 메시지 객체 주소
    }

    if (name !== "emaildomainRef") {
      if (ref.current.value === "") {
        // msgRef.current.style.setProperty("color", "red");
        msgRef.current.classList.remove("hidden");
        ref.current.focus();
        return false;
      }
    } else {
      if (ref.current.value === "default") {
        ref.current.focus();
        return false;
      }
    }
  }
  return true;
};

/***********************************
    Signup : 아이디 중복체크
************************************/
export const handleDuplicateIdCheck = (
  idRef,
  pwdRef,
  idMsgRef,
  setIdCheckResult
) => {
  if (idRef.current.value === "") {
    idMsgRef.current.style.setProperty("color", "red");
    idRef.current.focus();
    return false;
  } else {
    /** 아이디 중복 체크 <--> 서버 연동 */
    axios
      .post("http://localhost:9000/member/idcheck", {
        id: idRef.current.value,
      })
      .then((res) => {
        if (res.data.result === 1) {
          toast.warn(
            <>
              이미 사용중인 아이디 입니다. <br />
              새로운 아이디를 입력해주세요.
            </>
          );
          idRef.current.focus();
          return false;
        } else {
          toast.success("사용이 가능한 아이디 입니다.");
          setIdCheckResult("complete");
          pwdRef.current.focus();
          return false;
        }
      })
      .catch((error) => console.log(error));
  }
};

/****************************************
    Signup : 비밀번호&비밀번호 확인 체크
*****************************************/
export const handlePasswordCheck = (pwdRef, cpwdRef, nameRef) => {
  if (pwdRef.current.value === "") {
    pwdRef.current.focus();
    return false;
  } else if (cpwdRef.current.value === "") {
    cpwdRef.current.focus();
    return false;
  } else {
    if (pwdRef.current.value === cpwdRef.current.value) {
      toast.success("비밀번호가 동일합니다.");
      nameRef.current.focus();
      return false;
    } else {
      toast.warn(
        <>
          비밀번호가 다릅니다. <br />
          다시 입력해주세요.
        </>
      );
      pwdRef.current.value = "";
      cpwdRef.current.value = "";
      pwdRef.current.focus();
      return false;
    }
  }
};

/**
 * title : 회원가입 폼 체크
 */
export const validateSignup = (refs, msgRefs, formData) => {
  const refEntries = Object.entries(refs.current);
  const msgRefEntries = Object.entries(msgRefs.current);

  //refEntries 배열객체와 msgRefEntries 배열객체의 인덱스를 동일하게 체크한다!!
  for (let i = 0; i < refEntries.length; i++) {
    const item = refEntries[i];
    const name = item[0];
    const ref = item[1]; // 데이터 입력폼 객체 주소

    let msgItem,
      msgName,
      msgRef = null;

    if (i < refEntries.length - 1) {
      msgItem = msgRefEntries[i];
      msgName = msgItem[0];
      msgRef = msgItem[1]; // 데이터 입력폼의 메시지 객체 주소
    }

    if (name !== "emaildomainRef") {
      if (ref.current.value === "") {
        // msgRef.current.style.setProperty("color", "red");
        msgRef.current.classList.remove("hidden");
        ref.current.focus();
        return false;
      }
    } else {
      if (ref.current.value === "default") {
        ref.current.focus();
        return false;
      }
    }
  }
  return true;
};
