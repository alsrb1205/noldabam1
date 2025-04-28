import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { closeLoginModal } from "../../features/modal/modalSlice";

export default function LoginHeader({ modalType }) {
  const dispatch = useDispatch();

  return (
    <div className="relative flex items-center justify-between h-12">
      {modalType === "login" ? (
        <>
          <button
            onClick={() => dispatch(closeLoginModal())}
            className="flex items-center justify-center w-8 h-8 text-gray-400 sm:hidden"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
          </button>
        </>
      ) : (
        <h2 className="text-[24px] font-bold">
          {
            {
              signup: "회원가입",
              findId: "아이디 찾기",
              findPwd: "비밀번호 찾기",
            }[modalType]
          }
        </h2>
      )}
      <button
        onClick={() => dispatch(closeLoginModal())}
        className={`items-center justify-center text-black duration-300 hover:rotate-90 ${
          modalType === "signup" ? "flex sm:flex" : "hidden sm:flex"
        }`}
      >
        <FontAwesomeIcon icon={faXmark} className="text-[20px]" />
      </button>
    </div>
  );
}
