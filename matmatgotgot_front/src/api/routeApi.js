import axios from "axios";

export const fetchTmapDuration = async (start, end, type) => {
  const tmapAppKey = import.meta.env.VITE_TMAP_APP_KEY;

  // 도보(Pedestrian)와 자동차(Car)의 엔드포인트 및 가이드가 다릅니다.
  const url =
    type === "WALK"
      ? "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function"
      : "https://apis.openapi.sk.com/tmap/routes?version=1&callback=function";

  try {
    const response = await axios.post(
      url,
      {
        startX: start.lng, // TMAP은 X축이 경도(Lng)입니다.
        startY: start.lat, // TMAP은 Y축이 위도(Lat)입니다.
        endX: end.lng,
        endY: end.lat,
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        startName: start.name,
        endName: end.name,
        searchOption: "0", // 자동차 최적경로 옵션
      },
      {
        headers: {
          appKey: tmapAppKey,
          "Content-Type": "application/json",
        },
      },
    );

    // TMAP 응답 구조에서 총 소요 시간(초 단위) 추출 -> 분 단위 변환
    if (response.data && response.data.features) {
      const totalTimeSeconds = response.data.features[0].properties.totalTime;
      return Math.ceil(totalTimeSeconds / 60);
    }
    return null;
  } catch (error) {
    console.error(`TMAP (${type}) 호출 실패:`, error);
    return null;
  }
};

// 2. ODsay API (대중교통 소요 시간 계산)
export const fetchOdsayDuration = async (start, end) => {
  const odsayApiKey = import.meta.env.VITE_ODSAY_API_KEY;
  const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${start.lng}&SY=${start.lat}&EX=${end.lng}&EY=${end.lat}&apiKey=${encodeURIComponent(odsayApiKey)}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.result && response.data.result.path) {
      // 최적 경로(첫 번째 패스)의 총 소요 시간(분 단위) 추출
      const totalTimeMinutes = response.data.result.path[0].info.totalTime;
      return totalTimeMinutes;
    }
    return null;
  } catch (error) {
    console.error("ODsay API 호출 실패:", error);
    return null;
  }
};
