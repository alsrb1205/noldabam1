import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './cardslider.css'

import { EffectCards } from 'swiper/modules';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setInputValue } from '../../features/userInfo/userInfoSlice';
import { useRegionSearch } from '../../hooks/useRegionSearch';

export default function CardSlider() {
  const dispatch = useDispatch();
  const [travelList, setTravelList] = useState([]);
  
  // 지역 검색 훅 사용
  const { searchRegion } = useRegionSearch(0);
  
  // 여행지 목록
  useEffect(() => {
    axios.get('/json/travellist.json')
      .then(res => setTravelList(res.data))
      .catch(err => console.log(err));
  }, []);

  // 지역 클릭 핸들러
  const handleRegionClick = (city) => {
    dispatch(setInputValue(city));
    searchRegion(city);
  };

  return (
    <>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="cardslider"
        >
        <div className='absolute top-[10px] right-[60px] text-[20px] z-10 text-white'>
          놀다밤과 떠나는 최고의 여행!
        </div>
        {
          travelList.map((item, index) =>
            <SwiperSlide key={index}>
              <div className='relative flex'
                onClick={() => handleRegionClick(item.city)}
                >
                <div className={`absolute top-[320px] left-[70px] font-bold text-[24px] ${item.textcolor} z-10`}>
                  {item.city}
                </div>
                <img className='z-0' src={item.image} alt="" />
              </div>
            </SwiperSlide>
          )
        }
      </Swiper>
    </>
  );
}
