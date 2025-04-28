import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HomeFull from "./HomeFull";

export default function Home() {
    const { setHeaderHeight, setHeaderLogo, headerHeight, setHeaderBg } = useOutletContext();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1399);
    
    useEffect(() => {
        const handleResize = () => {
          setIsDesktop(window.innerWidth > 1399);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

return  (
    <HomeFull
      setHeaderHeight={setHeaderHeight}
      setHeaderLogo={setHeaderLogo}
      headerHeight={headerHeight}
      setHeaderBg={setHeaderBg}
    />
  )}
