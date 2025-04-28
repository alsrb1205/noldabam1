import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function useAccommodationData(location, subLocation, type, keyword) {
  const [accommodationList, setAccommodationList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Redux에서 accommodationType 가져오기
  const accommodationType = useSelector((state) => state.userInfo.accommodationType);
  const category = useSelector((state) => state.toggle.category);
  
  // type 파라미터가 없으면 Redux의 accommodationType 사용
  const effectiveType = type || accommodationType;

  useEffect(() => {
    // 카테고리가 accommodation이 아니면 API 호출하지 않음
    if (category !== "accommodation") {
      return;
    }

    if (!location) {
      const fetchKeywordData = async () => {
        setLoading(true);
        try {
          if (!keyword) {
            setAccommodationList([]);
            setLoading(false);
            return;
          }
          
          const { data } = await axios.get("http://localhost:9000/accommodation/searchKeyword", {
            params: { keyword }
          });
          
          const items = data?.response?.body?.items?.item || [];
          const normalized = Array.isArray(items) ? items : [items];

          // 방 정보 API 호출 제거하고 기본 정보만 반환
          const mapped = normalized.map(item => ({
            contentid: item.contentid,
            title: item.title, 
            location: item.addr1 || "지역 미정",
            image: item.firstimage || "",
            type: "숙박",
            rating: 4.5,
            reviews: "리뷰 없음",
            originalPrice: 150000,
            salePrice: 110000,
            cat3: item.cat3
          }));

          setAccommodationList(mapped);
        } catch (err) {
          console.error("❌ [useAccommodationData] 키워드 검색 실패:", err);
          setAccommodationList([]);
        } finally {
          setLoading(false);
        }
      };

      fetchKeywordData();
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
          // 항상 type을 보내도록 수정
          const baseParams = {
            location,
            subLocation,
            type: effectiveType || "전체" // fallback 추가해도 OK
          };

          // ✅ type이 전체가 아니면 type도 params에 포함
          if (effectiveType !== "전체") {
            baseParams.type = effectiveType;
          }
          
          const { data } = await axios.get("http://localhost:9000/accommodation/search", {
            params: baseParams
          });

          const items = data?.response?.body?.items?.item || [];
          const normalized = Array.isArray(items) ? items : [items];

          // 방 정보 API 호출 제거하고 기본 정보만 반환
          const mapped = normalized.map(item => ({
            contentid: item.contentid,
            title: item.title, 
            location: item.addr1 || "지역 미정",
            image: item.firstimage || "",
            type: "숙박",
            rating: 4.5,
            reviews: "리뷰 없음",
            originalPrice: 150000,
            salePrice: 110000,
            cat3: item.cat3
          }));

          setAccommodationList(mapped);
      } catch (err) {
        console.error("❌ [useAccommodationData] 숙박 정보 호출 실패:", err);
        setAccommodationList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location, subLocation, effectiveType, keyword, category]);

  return { accommodationList, loading, setLoading };
}

