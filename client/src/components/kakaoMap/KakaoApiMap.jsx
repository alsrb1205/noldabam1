import { useEffect, useRef } from "react";

export default function KakaoApiMap({ address }) {
  const mapRef = useRef(null);
  const KAKAO_MAP_KEY = process.env.REACT_APP_KAKAO_MAP_KEY; // 본인 키 사용

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => initMap());
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      const container = mapRef.current;
      if (!container) return; // ⚠️ DOM이 없으면 실행하지 않음!
    
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 8,
      };
    
      const map = new window.kakao.maps.Map(container, options);
      const geocoder = new window.kakao.maps.services.Geocoder();
    
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const marker = new window.kakao.maps.Marker({ map, position: coords });
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:14px;">📍 ${address}</div>`,
          });
          infoWindow.open(map, marker);
          map.setCenter(coords);
        } else {
          console.error("❗ 주소 검색 실패:", address);
        }
      });
    };
    

    // script 로딩 상태에 따라 다르게 처리
    if (!window.kakao || !window.kakao.maps) {
      loadScript();
    } else {
      initMap();
    }
  }, [address]); // 주소가 바뀔 때마다 다시 지도 표시

  return (
    <div className="">
      <h2 className="mb-2 text-lg font-semibold">지도</h2>
      <div ref={mapRef} className="w-full h-[160px] rounded border select-none" />
    </div>
  );
}
