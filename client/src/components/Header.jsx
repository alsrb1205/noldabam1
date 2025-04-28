import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { GoUnlock } from "react-icons/go";
import {
  faUser,
  faCalendar,
} from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal } from "../features/modal/modalSlice";
import {
  toggleMenu,
} from "../services/headerApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "motion/react";
import { getLogout } from "../services/authApi.js";
import SearchBar from "./SearchBar.jsx";
import ToastConfirm from "./login/ToastConfirm.jsx";

export default function Header({ height, headerLogo, headerBg }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMenuOpen = useSelector((state) => state.header.isHeaderToggleOpen);
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 화면이 1024px 이상이면 데스크탑 모드, 미만이면 모바일 모드로 판단
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const prevPath = useRef(location.pathname);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 아이콘 색상 결정 함수
  const getIconColor = () => {
    // 메인 페이지와 테스트 페이지는 항상 흰색
    if (location.pathname === '/' || location.pathname === "/performancereservation") {
      return 'text-white';
    }
    // 스크롤 상태에 따라 색상 변경되는 페이지들
    if (location.pathname === '/accommodation' || location.pathname === '/theme' || location.pathname === '/mypage' || location.pathname === '/reservation') {
      return isScrolled ? 'text-black' : 'text-white';
    }
    // 나머지 페이지들은 검은색
    return 'text-black';
  };

  const iconColor = getIconColor();

  // 검색창 토글: 현재 열려있으면 닫고, 아니면 연다.
  const handleToggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleLoginToggle = () => {
    if (isLoggedIn) {
      ToastConfirm("정말 로그아웃하시겠습니까?", () => {
        dispatch(getLogout());
        dispatch(openLoginModal());
        navigate('/');
      });
    } else {
      dispatch(openLoginModal());
    }
  };

  // 창 크기 변화 감지: 데스크탑 모드 여부 업데이트, 데스크탑 모드에서는 모바일 메뉴가 열려 있으면 닫음
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop && isMenuOpen) {
        dispatch(toggleMenu());
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, isMenuOpen]);

  // 페이지 이동 시 검색창 닫기 (최초 렌더는 건너뛰기)
  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      setSearchOpen(false);
      prevPath.current = location.pathname;
    }
  }, [location]);

  const desktopNavVariants = {
    visible: { x: 0, opacity: 1, scale: 1 },
    exit: { x: 100, opacity: 0, scale: 0.5 },
  };

  return (
    <header
      className={`
        ${isDesktop ? "fixed" : "absolute"}
        top-0 left-0 z-50 flex items-center justify-between w-full text-white transition-all duration-300 
        ${location.pathname !== "/performancereservation" ? `${headerBg}` : ""}
        px-[30px]`}
      style={{ height: `${height}px` }}
    >
      <Link to="/">
        <div className="flex items-center pr-[10px]">
          <img
            className={`${headerLogo === "small" ? "w-[150px]" : "w-[180px]"}`}
            src="/images/logo/logo1.png"
            alt="logo"
          />
        </div>
      </Link>
      {
        location.pathname !== "/performancereservation" && (
      <AnimatePresence>
        <motion.nav
          variants={desktopNavVariants}
          initial="visible"
          animate="visible"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.5,
          }}
        >
          <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
        </motion.nav>
      </AnimatePresence>

        )
      }

      {/* 아이콘 그룹 (모바일) */}
      <AnimatePresence>
        {!isDesktop && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.5,
            }}
            className="ml-[20px] flex gap-[16px] items-center"
          >
            {/* 로그인 */}
            {!isLoggedIn ? (
              <button onClick={() => handleLoginToggle()}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={`text-[24px] mt-[4px] ${iconColor}`}
                />
              </button>
            ) : (
              <div className="flex gap-[16px]">
                <Link to="/mypage">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className={`text-[26px] mt-[4px] ${iconColor}`}
                  />
                </Link>
                <button onClick={() => handleLoginToggle()}>
                  <GoUnlock
                    className={`text-[28px] ${iconColor}`}
                  />
                </button>
              </div>
            )}
            {
              location.pathname !== "/performancereservation" && (
                <IoIosSearch
                  onClick={handleToggleSearch}
                  className={`text-[32px] cursor-pointer ${iconColor}`}
                />
              )
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* 아이콘 그룹 (데스크탑) */}
      {isDesktop && (
        <div className="ml-[20px] flex gap-[16px] items-center">
          {!isLoggedIn ? (
            <button onClick={() => handleLoginToggle()}>
              <FontAwesomeIcon
                icon={faUser}
                className={`text-[26px] mt-[4px] ${iconColor}`}
              />
            </button>
          ) : (
            <div className="flex gap-[16px]">
              <Link to="/mypage">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className={`text-[26px] mt-[4px] ${iconColor}`}
                />
              </Link>
              <button onClick={() => handleLoginToggle()}>
                <GoUnlock
                  className={`text-[28px] ${iconColor}`}
                />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
