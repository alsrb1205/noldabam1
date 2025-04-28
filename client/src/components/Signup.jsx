import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import UsernameStep from "./signup/UsernameStep.jsx";
import PasswordStep from "./signup/PasswordStep.jsx";
import NameStep from "./signup/NameStep.jsx";
import PhoneStep from "./signup/PhoneStep.jsx";
import EmailStep from "./signup/EmailStep.jsx";
import SubmitStep from "./signup/SubmitStep.jsx";

export default function Signup() {
  const [step, setStep] = useState(1);
  const methods = useForm({ mode: "onChange" });

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const totalSteps = 6;
  const progressPercent = (step / totalSteps) * 100;

  return (
    <FormProvider {...methods}>
      <form className="w-full max-w-md mx-auto mt-10">
        {/* 상단 프로그레스 바 */}
        {step !== 6 && (
          <div className="w-full my-[30px]">
            <div className="w-full h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 transition-all duration-300 bg-blue-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 각 스텝 컴포넌트 */}
        {step === 1 && <UsernameStep nextStep={nextStep} />}
        {step === 2 && <PasswordStep nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <NameStep nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <PhoneStep nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <EmailStep nextStep={nextStep} prevStep={prevStep} />}
        {step === 6 && <SubmitStep prevStep={prevStep} />}
      </form>
    </FormProvider>
  );
}
