import React, { useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
// import './calendar.css'
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFirstDate, setLastDate } from '../../features/userInfo/userInfoSlice';
import { useLocation } from 'react-router-dom';

export default function Calendar({
  isMusical = false,
  maxDate = null,
  minDate = null,
  onDateChange = null,
  selectedDate = null,
  inline = false,
  className = ""
}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const datePickerRef = useRef(null);

  // 날짜 선택을 위한 상태 관리
  // ✅ Redux에서 날짜 가져오기
  const firstDate = useSelector((state) => state.userInfo.firstDate);
  const lastDate = useSelector((state) => state.userInfo.lastDate);

  // ISO 문자열이 아닌 로컬 날짜 문자열을 사용하기 위해 Date 객체로 변환
  const startDate = isMusical ? (selectedDate ? new Date(selectedDate) : null) : (firstDate ? new Date(firstDate) : null);
  const endDate = lastDate ? new Date(lastDate) : null;

  // 로컬 날짜를 "YYYY-MM-DD" 형식으로 변환하는 함수 (en-CA 로케일 사용)
  const formatLocalDate = (date) => {
    return date.toLocaleDateString('en-CA');
  };

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (datePickerRef.current && datePickerRef.current.state.open) {
        datePickerRef.current.setOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  // 날짜 선택 시 Redux 상태 업데이트 (로컬 날짜 문자열 사용)
  const handleChange = (dates) => {
    if (isMusical) {
      if (onDateChange) {
        onDateChange(dates);
      }
    } else if (location.pathname === "/performancereservation") {
      dispatch(setFirstDate(dates ? formatLocalDate(dates) : ""));
      dispatch(setLastDate(""));
    } else {
      const [start, end] = dates;
      dispatch(setFirstDate(start ? formatLocalDate(start) : ""));
      dispatch(setLastDate(end ? formatLocalDate(end) : ""));
    }
  };

  return (
      <DatePicker
        ref={datePickerRef}
        inline={inline}
        selectsRange={!isMusical && location.pathname !== "/performancereservation"}
        selected={startDate}
        startDate={startDate}
        endDate={!isMusical && location.pathname !== "/performancereservation" ? endDate : null}
        onChange={handleChange}
        isClearable={true}
        placeholderText={isMusical ? "예매 날짜 선택 ✅" : "날짜 선택"}
        popperClassName="left-0"
        popperPlacement="bottom-start"
        className={`border cursor-pointer caret-transparent focus:outline-none 
          placeholder:font-semibold placeholder:text-gray-700
          ${className}
        `}
        dateFormat={isMusical ? "yyyy.MM.dd" : (location.pathname === "/performancereservation" ? "yyyy.MM.dd" : "MM.dd")}
        minDate={isMusical ? minDate : new Date()}
        maxDate={maxDate}
        wrapperClassName={location.pathname !== '/' ? "w-full" : ""}
      />
  );
}