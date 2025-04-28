import React from "react";
import Card from "./Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; // 페이징 필요 시
import "swiper/css/navigation"; // 네비게이션 필요 시
import { useDispatch } from "react-redux";
import { setThemeType, setInputValue, setKeyword } from "../../features/userInfo/userInfoSlice";
import { useNavigate } from "react-router-dom";

import { Navigation } from "swiper/modules";

const CardApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cardData = [
    {
      header: "뮤지컬",
      dataImage: "/images/performance/musical.jpg",
      type: "뮤지컬"
    },
    {
      header: "콘서트",
      dataImage: "/images/performance/concert.jpg",
      type: "대중음악"
    },
    {
      header: "클래식",
      dataImage: "/images/performance/classic.jpg",
      type: "클래식"
    },
    {
      header: "연극",
      dataImage: "/images/performance/theater.png",
      type: "연극"
    },
    {
      header: "국악",
      dataImage: "/images/performance/korean-music.png",
      type: "국악"
    },
    {
      header: "무용",
      dataImage: "/images/performance/ballet.jpg",
      type: "무용(서양/한국무용)"
    },
    {
      header: "마술",
      dataImage: "/images/performance/magic.jpg",
      type: "서커스/마술"
    },
    {
      header: "대중무용",
      dataImage: "/images/performance/dance.jpg",
      type: "대중무용"
    },
    {
      header: "복합",
      dataImage: "/images/performance/mixed.jpg",
      type: "복합"
    }
  ];
  const handleCardClick = (type) => {
    dispatch(setThemeType(type));
    dispatch(setInputValue(""));
    dispatch(setKeyword(""));
    navigate("/theme");
  };

  return (
    <>
    <div>
      <div className="relative">
        <p className="absolute -top-[40px] right-0 text-[20px] z-10 text-white">
          공연도 놀다밤과 함께
        </p>
      </div>
      <Swiper
        spaceBetween={20}
        slidesPerView={"auto"}
        grabCursor={true}
        modules={Navigation}
        className="mt-[60px]"
      >
        {cardData.map((card, index) => (
          <SwiperSlide key={index} style={{ width: "240px" }}>
            <Card
              dataImage={card.dataImage}
              header={card.header}
              onClick={() => handleCardClick(card.type)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </>
  );
};

export default CardApp;
