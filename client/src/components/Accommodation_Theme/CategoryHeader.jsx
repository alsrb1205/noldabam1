import { FaFilter } from "react-icons/fa";
import { useCategory } from "../../context/CategoryContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import useStickyHeader from "../../hooks/useStickyHeader.js";

export default function CategoryHeader({ title, filters }) {
  const { isSticky, setIsSticky, isOpening, setIsOpening } = useCategory();
  const [isMobile, setIsMobile] = useState(false);
  const [key, setKey] = useState(0);

  // 카테고리 타입 결정 (title에서 추출)
  const categoryType = title.includes("숙소") ? "accommodation" : "theme";
  
  // useStickyHeader 훅 사용
  useStickyHeader(categoryType, setIsSticky);

  useEffect(() => {
    const checkMobile = () => {
      const wasMobile = isMobile;
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      
      // 화면 크기가 모바일로 변경될 때만 키를 업데이트
      if (!wasMobile && isNowMobile) {
        setKey(prev => prev + 1);
      }
      
      // 화면 크기가 데스크톱으로 변경될 때 패널 닫기
      if (wasMobile && !isNowMobile && isOpening) {
        setIsOpening(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile, isOpening, setIsOpening]);

  // 필터 버튼 클릭 핸들러를 useCallback으로 메모이제이션
  const handleFilterClick = useCallback(() => {
    setIsOpening(true);
  }, [setIsOpening]);

  return (
    <>
      <div className={`p-[10px] md:pl-[290px] md:static sticky top-0 z-30 bg-white sticky-header ${isSticky ? 'shadow-lg border-b' : ''}`}>
        <div className="w-full px-[16px] py-2">
          <div className="flex items-center justify-between gap-2 pointer-events-auto">
            <span className="text-lg font-semibold ">
              {title} 검색 결과 {filters.length}개
            </span>
            <AnimatePresence mode="wait">
              {isMobile && (
                <motion.button
                  key={key}
                  className="p-1.5 bg-white rounded-full shadow-lg block md:hidden"
                  onClick={handleFilterClick}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <FaFilter />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
} 