import React, { useState, useEffect } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Footer from "../components/Footer";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import CardApp from "../components/card/CardApp";
import CardSlider from "../components/homeslider/CardSlider";
import { setCurrentSection } from "../features/fullpage/fullpageSlice";

// 데스크탑용 풀페이지 컴포넌트
export default function HomeFull({ setHeaderHeight, setHeaderLogo, headerHeight, setHeaderBg }) {
  const activeSection = useSelector((state) => state.fullpage.activeSection);
  const currentSection = useSelector((state) => state.fullpage.currentSection);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
    };

    window.addEventListener('resize', handleResize);
    // 초기 로드 시에도 체크
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 풀페이지 API 초기화 후 currentSection 업데이트
  useEffect(() => {
    const updateCurrentSection = () => {
      if (window.fullpage_api) {
        const activeSection = window.fullpage_api.getActiveSection();
        if (activeSection && typeof activeSection.index === 'function') {
          const sectionIndex = activeSection.index();
          dispatch(setCurrentSection(sectionIndex));
        }
      }
    };

    // 풀페이지 API가 초기화될 때까지 대기
    const checkFullpageApi = setInterval(() => {
      if (window.fullpage_api) {
        updateCurrentSection();
        clearInterval(checkFullpageApi);
      }
    }, 100);

    // 5초 후에도 API가 초기화되지 않으면 인터벌 중단
    setTimeout(() => clearInterval(checkFullpageApi), 5000);

    return () => clearInterval(checkFullpageApi);
  }, [dispatch]);

  return (
    <div
      className="nodrag"
      style={{ height: `calc(100vh - ${headerHeight}px)` }}>
      <ReactFullpage
        navigation
        scrollingSpeed={400}
        touchSensitivity={20}
        onLeave={(origin, destination) => {
          if (!destination || destination.index == null) return;
          setTimeout(() => {
            window.dispatchEvent(new Event("resize")); // ✅ 강제 resize 트리거
          }, 0);
          if (destination.index === 0) {
            setHeaderHeight(120);
            setHeaderLogo("");
            setHeaderBg("transparent");
          } else {
            setHeaderHeight(80);
            setHeaderLogo("small");
            setHeaderBg("");
          }

          // 섹션 변경 시 currentSection 업데이트
          dispatch(setCurrentSection(destination.index));
        }}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="section"
              style={{
                backgroundImage: "url('/images/home/bg6.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="w-full overflow-hidden">
                <CardSlider />
              </div>
            </div>
            <div className="text-2xl text-white bg-blue-500 section"
              style={{
                backgroundImage: "url('/images/home/background3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="w-[100%] p-[50px] backdrop-blur-sm bg-white/10" >
                <motion.div
                  key={currentSection}  // Use the actual section number as key
                  initial={{ opacity: 0, translateY: 40 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <CardApp />
                </motion.div>
              </div>
            </div>
            {/* Footer는 데스크탑에서는 풀페이지 섹션으로 동작 */}
            <div className="section footer-section !h-[200px] overflow-visible">
              <Footer />
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </div>
  );
}
