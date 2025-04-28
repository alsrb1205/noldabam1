export const weatherTextToIcons = (text) => {
  console.log(text);
  
    if (!text) return "sunny"; // 기본값
  
    if (text.includes("대체로 맑음") || text.includes("부분적으로 맑음")) return "mostlySunny";
    if (text.includes("맑음") || text.includes("화창")) return "sunny";
    if (text.includes("구름") || text.includes("흐린")) return "cloudy";
    if (text.includes("근처 곳곳에 비") || text.includes("비") || text.includes("폭우") || text.includes("소나기")) return "rainy";
    if (text.includes("안개")) return "foggy";
    if (text.includes("천둥")) return "thunder";
    if (text.includes("눈") || text.includes("눈보라") || text.includes("폭설")) return "snowy";
  
    return "sunny"; // 예외 처리용 기본
  };