import LoginHeader from "./login/LoginHeader.jsx";
import LoginForm from "./login/LoginForm.jsx";
import Signup from "./Signup.jsx";
import FindId from "./FindId.jsx";
import FindPwd from "./FindPwd.jsx";
import { useLogin } from "../hooks/useLogin.js";

export default function Login() {
  const {
    isLoginOpen,
    modalType,
    formData,
    setFormData,
    refs,
    saveId,
    setSaveId,
  } = useLogin();

  if (!isLoginOpen) return null;

  return (
    <div>
      <div className="fixed inset-0 z-[90] bg-black bg-opacity-75 backdrop-blur-[1px]" />
      <div className="z-[100] border-0 sm:border p-[30px] w-full h-full sm:max-w-[470px] sm:h-auto text-airlime-black fixed top-0 left-0 sm:top-1/2 sm:left-1/2 sm:translate-x-[-50%] sm:translate-y-[-50%] bg-white sm:rounded-[10px]">
        <div className="flex flex-col justify-center h-full sm:block">
          <LoginHeader modalType={modalType} />
          {(() => {
            switch (modalType) {
              case "login":
                return (
                  <LoginForm
                    formData={formData}
                    setFormData={setFormData}
                    refs={refs}
                    saveId={saveId}
                    setSaveId={setSaveId}
                  />
                );
              case "signup":
                return <Signup />;
              case "findId":
                return <FindId />;
              case "findPwd":
                return <FindPwd />;
              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
