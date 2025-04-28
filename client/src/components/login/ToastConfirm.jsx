import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function showToastConfirm(message, onConfirm) {
  toast(
    ({ closeToast }) => (
      <div className="w-[280px] text-sm text-gray-800">
        <p className="mb-3">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onConfirm();
              closeToast();
            }}
            className="px-3 py-1.5 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition text-xs"
          >
            확인
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition text-xs"
          >
            취소
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      position: "top-right",
      style: {
        borderRadius: "0.75rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "1rem",
        backgroundColor: "#fff",
      },
    }
  );
}
