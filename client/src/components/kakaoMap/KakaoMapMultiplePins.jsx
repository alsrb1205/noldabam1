import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import RoomListModal from "../Accommodation_Theme/RoomListModal.jsx";
import LoadingSpinner from "../common/LoadingSpinner";

export default function KakaoMapMultiplePins({ displayedPins = [], isLoading = false }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const KAKAO_MAP_KEY = process.env.REACT_APP_KAKAO_MAP_KEY;

  useEffect(() => {
    const loadScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.maps/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(() => resolve());
        };
        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      if (!mapRef.current) return;

      // 이미 지도 인스턴스가 있다면 제거
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        mapRef.current.innerHTML = '';
      }

      const container = mapRef.current;
      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 1,
      });

      // 지도 인스턴스 저장
      mapInstanceRef.current = map;

      const geocoder = new window.kakao.maps.services.Geocoder();
      const bounds = new window.kakao.maps.LatLngBounds();

      if (Array.isArray(displayedPins) && displayedPins.length > 0) {
        const promises = displayedPins.map((place) => {
          return new Promise((resolve) => {
            if (!place || !place.address) {
              resolve();
              return;
            }

            const { name, address } = place;

            geocoder.addressSearch(address, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                bounds.extend(coords);

                const marker = new window.kakao.maps.Marker({ map, position: coords });

                const infowindow = new window.kakao.maps.InfoWindow({
                  content: `<div style="width: 150px; padding:5px; font-size:13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</div>`,
                });
                infowindow.open(map, marker);

                window.kakao.maps.event.addListener(marker, "click", () => {
                  setSelectedPlace(place);
                });
              }
              resolve();
            });
          });
        });

        await Promise.all(promises);
        map.setBounds(bounds);
      }
    };

    const initializeMap = async () => {
      if (!window.kakao || !window.kakao.maps) {
        await loadScript();
      }
      await initMap();
    };

    initializeMap();

    // cleanup 함수
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }
      }
    };
  }, [displayedPins, KAKAO_MAP_KEY]);

  return (
    <div className="relative">
      {isLoading ? (
        <div className="absolute inset-0 w-full h-[400px] rounded-xl border flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner/>
          </div>
        </div>
      ) : null}
      <div ref={mapRef} className="w-full h-[400px] rounded-xl border select-none" />
      
      <Modal
        isOpen={!!selectedPlace}
        onRequestClose={() => setSelectedPlace(null)}
        className="max-w-2xl p-6 mx-auto bg-white shadow-xl rounded-xl z-[999]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
        ariaHideApp={false}
      >
        {selectedPlace && (
          <RoomListModal
            accommodation={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </Modal>
    </div>
  );
}