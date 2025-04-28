import { ClipLoader } from "react-spinners";

const LoadingSpinner = ({ 
  size = 50, 
  color = "#3B82F6", 
  text = "데이터를 불러오는 중입니다...",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <ClipLoader color={color} size={size} />
      {text && <p className="mt-4 text-lg text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 