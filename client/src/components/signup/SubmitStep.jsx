import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../features/modal/modalSlice.js";

export default function SubmitStep({ prevStep }) {
  const dispatch = useDispatch();
  const { handleSubmit, getValues } = useFormContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const data = getValues();
    const payload = { // 회원가입 폼
      id: data.username,
      pwd: data.password,
      name: data.name,
      phone: data.phone,
      emailname: data.emailLocal,
      emaildomain: data.emailDomain,
    };

    try {
      const res = await axios.post(
        "http://localhost:9000/member/signup",
        payload
      );
      if (res.data.result_rows === 1) {
        setTimeout(() => {
          dispatch(openLoginModal());
        }, 1000);
      } else {
        toast.error("회원가입에 실패했습니다");
      }
    } catch (err) {
      toast.error("회원가입 요청 중 오류 발생");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold text-center">
        모든 입력이 완료되었습니다
      </p>
      <p className="text-sm text-center text-gray-500">
        가입을 완료하시려면 아래 버튼을 눌러주세요
      </p>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className={`py-2 px-4 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          {loading ? "처리 중..." : "가입 완료"}
        </button>
      </div>
    </div>
  );
}
