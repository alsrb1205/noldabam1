import { FaTimes } from "react-icons/fa";
import FormContents from "./FormContents.jsx";
import { useCategory } from "../../context/CategoryContext.jsx";

export default function MobileSlidePanel() {
  const { isOpening, setIsOpening } = useCategory();

  return (
    <div className="">
      <div className={`fixed block inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpening ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 h-full w-3/4 bg-white transition-transform duration-300 ease-in-out ${isOpening ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 space-y-4 mt-[40px] text-sm">
            {/* 닫기 버튼 */}
            <button
              type="button"
              className="absolute left-[15px] border border-gray-300 p-2 bg-white rounded-full shadow-lg top-[15px]"
              onClick={() => setIsOpening(false)}
            >
              <FaTimes className="w-4 h-4 text-gray-500" />
            </button>
            <FormContents />
          </div>
        </div>
      </div>
    </div>
  );
} 