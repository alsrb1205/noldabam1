import { useContext } from "react";
import Cards from "../components/Accommodation_Theme/Cards";
import LeftSideBar from "../components/Accommodation_Theme/LeftSideBar";
import { useSelector } from "react-redux";
import WeatherBanner from "../components/Accommodation_Theme/WeatherBanner.jsx";
import { FiltersContext } from "../context/FiltersContext.jsx";
import MobileSlidePanel from "../components/Accommodation_Theme/MobileSlidePanel.jsx";
import CategoryHeader from "../components/Accommodation_Theme/CategoryHeader.jsx";

export default function Accommodation() {
  const { filters } = useContext(FiltersContext);
  const location = useSelector((state) => state.userInfo.location);
  const keyword = useSelector((state) => state.userInfo.keyword);

  const headerTitle = `숙소 '${keyword ? keyword : location}'`;

  return (
    <>
      <WeatherBanner />
      <CategoryHeader title={headerTitle} filters={filters} />
      <div className="flex justify-center px-[16px] max-w-none">
        <LeftSideBar />
        <section className="w-[100%] px-0 max-w-none">
          <Cards />
        </section>
      </div>

      {/* 모바일 카테고리 패널 */}
      <MobileSlidePanel />
    </>
  );
}
