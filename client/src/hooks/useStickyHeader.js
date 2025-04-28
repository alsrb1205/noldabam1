import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategory } from '../features/toggle/toggleSlice.js';
import { useCategory } from '../context/CategoryContext.jsx';
export default function useStickyHeader(category) {
  const dispatch = useDispatch();
  const { setIsSticky } = useCategory();
  useEffect(() => {
    dispatch(setCategory(category));
  }, [dispatch, category]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.sticky-header');
      if (header) {
        const headerTop = header.getBoundingClientRect().top;
        setIsSticky(headerTop <= 0);
      }
    };

    const handleResize = () => {
      // 화면 크기 변경 시 스크롤 위치를 다시 확인
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // 초기 로드 시에도 스크롤 위치 확인
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsSticky]);
} 