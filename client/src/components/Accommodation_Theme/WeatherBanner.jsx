import { IoSunnyOutline, IoRainyOutline, IoCloudyOutline, IoSnowOutline, IoThunderstormOutline, IoPartlySunnyOutline } from "react-icons/io5";
import { weatherTextToIcons } from "../../utils/weatherTextToIcons.js";
import useWeather from "../../hooks/useWeather";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { BsCloudFog } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";


export default function WeatherBanner() {
  const { getImageByWeather, fetchWeather } = useWeather();
  const weather = useSelector((state) => state.weather.weather);
  const temp = useSelector((state) => state.weather.temp);
  const location = useSelector((state) => state.userInfo.location);

  useEffect(() => {
    fetchWeather();
  }, [location]); // location이 변경될 때마다 날씨 데이터를 다시 가져옵니다

  // 날씨에 따른 아이콘 선택
  const getWeatherIcon = () => {
    const iconKey = weatherTextToIcons(weather);

    switch (iconKey) {
      case 'sunny':
        return <IoSunnyOutline className="text-white w-[50px] h-[50px]" />;
      case 'mostlySunny':
        return <IoPartlySunnyOutline className="text-white w-[50px] h-[50px]" />;
      case 'rainy':
        return <IoRainyOutline className="text-white w-[50px] h-[50px]" />;
      case 'cloudy':
        return <IoCloudyOutline className="text-white w-[60px] h-[60px]" />;
      case 'snowy':
        return <IoSnowOutline className="text-white w-[60px] h-[60px]" />;
      case 'foggy':
        return <BsCloudFog className="text-white w-[60px] h-[60px]" />;
      case 'thunder':
        return <IoThunderstormOutline className="text-white w-[60px] h-[60px]" />;
      default:
        return <IoSunnyOutline className="text-white w-[60px] h-[60px]" />;
    }
  };

  // 애니메이션 변형 정의
  const containerVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 0.5, // 배경 애니메이션 완료 후 시작
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 1 }
    }
  };

  const backgroundVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.1,
      filter: "blur(20px)"
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      style={{
        backgroundImage: `url(${getImageByWeather()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className="m-0 w-full h-[300px] relative overflow-hidden"
      variants={backgroundVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        <motion.div 
          className="absolute top-[180px] right-[40px] flex gap-[40px] items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={weather} // 날씨가 변경될 때마다 애니메이션 재실행
        >
          <div className="flex flex-col gap-[10px]">
          <motion.div
          className="flex items-center justify-center"
          variants={itemVariants}>
            {getWeatherIcon()}
          </motion.div>
          <div className="flex gap-[10px] justify-center">
          <motion.div className="mb-2 text-[16px] text-white" variants={itemVariants}>
            {temp}°C
          </motion.div>
          </div>

          </div>

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
