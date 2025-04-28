// ✅ useThemeData.js
import { useEffect, useState } from "react";
import axios from "axios";
import { regionMap, themeType } from "../filtersData.js";
import { useSelector } from "react-redux";

export default function useThemeData({ category, type, location, firstDate, lastDate, keyword }) {
  const [themeList, setThemeList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Redux에서 themeType 가져오기
  const reduxThemeType = useSelector((state) => state.userInfo.themeType);
  const reduxCategory = useSelector((state) => state.toggle.category);
  
  // type 파라미터가 없으면 Redux의 themeType 사용
  const effectiveType = type || reduxThemeType;

  useEffect(() => {
    // 카테고리가 theme이 아니면 API 호출하지 않음
    if (reduxCategory !== "theme") {
      return;
    }
    
    console.log("[useThemeData] 훅 호출 파라미터:", { category, type: effectiveType, location, firstDate, lastDate, keyword });
    
    const fetchThemeData = async () => {
      // 키워드 검색인 경우 location이 없어도 API 요청
      if (category !== "theme" || !effectiveType || !firstDate || !lastDate) return;
      
      // 키워드 검색이 아닌 경우 location이 필요
      if (!keyword && !location) return;

      const regionCode = location === "전체" ? null : (location ? regionMap[location] : null);
      const themeCode = themeType[effectiveType];
      const stdate = firstDate.replace(/-/g, "");
      const eddate = lastDate.replace(/-/g, "");
      
      if (!themeCode) return;
      
      // 키워드 검색이 아닌 경우 regionCode가 필요
      if (!keyword && !regionCode && location !== "전체") return;

      try {
        console.log("[useThemeData] API 요청 파라미터:", { type: themeCode, location: regionCode, stdate, eddate, keyword });
        
        const { data } = await axios.get("http://localhost:9000/kopis/search", {
          params: {
            type: themeCode,
            location: regionCode,
            stdate,
            eddate,
            keyword,
          },
        });
        console.log("[useThemeData] API 응답:", data);

        const results = data?.dbs?.db || [];
        const normalized = Array.isArray(results) ? results : [results];

        const mapped = normalized.map(item => {
          console.log("[useThemeData] 매핑된 아이템:", {
            title: item.prfnm,
            fcltynm: item.fcltynm,
            mt20id: item.mt20id
          });
          
          return {
            title: item.prfnm,
            image: item.poster || "",
            area: item.area,
            period: `${item.prfpdfrom} ~ ${item.prfpdto}`,
            tag: item.genrenm,
            price: 0,
            category: item.genrenm,
            guides: [item.prfcast, item.fcltynm],
            warnings: ["환불 불가", "마스크 착용", "1인 3좌석까지 예매 가능합니다."],
            genrenm: item.genrenm,
            prfage: item.prfage,
            fcltynm: item.fcltynm,
            mt20id: item.mt20id
          };
        });

        setThemeList(mapped);
      } catch (err) {
        console.error("KOPIS API 호출 실패:", err);
        setThemeList([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchThemeData();
  }, [category, effectiveType, location, firstDate, lastDate, keyword, reduxCategory]);

  return { themeList, loading };
}
