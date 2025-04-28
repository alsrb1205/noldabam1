import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from "../components/chat/ChatBot";

export default function Layout() {
  const [headerHeight, setHeaderHeight] = useState(120);
  const [headerLogo, setHeaderLogo] = useState("");
  const [headerBg, setHeaderBg] = useState("transparent");
  const [showGoToTop, setShowGoToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // /test 경로일 때는 고정 스타일 적용
      if (location.pathname === "/performancereservation") {
        setHeaderHeight(80);
        setHeaderLogo("small");
        setHeaderBg("bg-white/60 backdrop-blur-md");
        return;
      }
      const y = window.scrollY;
      // 1) 홈(/)에서 화면이 1399 이하 -> fullpage 비활성화 상태
      // 2) 그 외 페이지 -> 기본 스크롤
      // => 두 경우 모두 스크롤에 반응
      if (y > 0) {
        setHeaderHeight(80);
        setHeaderLogo("small");
        setHeaderBg("bg-white/60 backdrop-blur-md");
        // 루트 경로가 아닐 때만 고투탑 버튼 표시
        if (location.pathname !== "/") {
          setShowGoToTop(true);
        }
      } else {
        setHeaderHeight(120);
        setHeaderLogo("");
        setHeaderBg("bg-transparent");
        setShowGoToTop(false);
      }
    };

    // 처음 진입 시점에도 한 번 확인
    handleScroll();
    // /test 경로일 때는 스크롤 이벤트 등록하지 않음
    if (location.pathname !== "/performancereservation") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div>
      {/* /admin 경로일 경우 Header 안 보여줌 */}
      {location.pathname !== "/admin" && location.pathname !== "/admin/active" &&(
        <Header height={headerHeight} headerLogo={headerLogo} headerBg={headerBg} />
      )}
      <div>
        {
          location.pathname !== "/performancereservation" && location.pathname !== "/admin" && location.pathname !== "/admin/active" &&
          (<ChatBot />)
        }
        <Outlet context={{ setHeaderHeight, setHeaderLogo, setHeaderBg }} />
      </div>
      {/* Footer가 "/" 또는 "/performancereservation" 경로에서는 보이지 않도록 설정 */}
      {location.pathname !== "/" && location.pathname !== "/performancereservation" && 
      location.pathname !== "/admin" && location.pathname !== "/admin/active" && <Footer />}
      
      {/* 고투탑 버튼 */}
      {showGoToTop && (
        <button
          onClick={scrollToTop}
          className="fixed p-3 text-white transition-all duration-300 rounded-full shadow-lg bottom-[100px] right-12 bg-blue-500 hover:bg-blue-600 hover:scale-105"
          aria-label="맨 위로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
