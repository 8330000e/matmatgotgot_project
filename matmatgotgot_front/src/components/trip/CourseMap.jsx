import { useEffect, useRef } from "react";

const CourseMap = ({
  list = [],
  width = "100%",
  height = "100%",
  minHeight = "400px",
}) => {
  const mapRef = useRef(null);
  const markerLayerRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    // Tmap 라이브러리 로드 확인
    if (!window.Tmapv2) {
      console.warn(
        "Tmapv2 라이브러리가 로드되지 않았습니다. index.html을 확인하세요.",
      );
      return;
    }

    // 1. 최초 1회만 지도 인스턴스 생성
    if (!mapRef.current) {
      mapRef.current = new window.Tmapv2.Map("tmap_shared_container", {
        center: new window.Tmapv2.LatLng(37.5665, 126.978), // 기본 서울 중심
        width: width,
        height: height,
        zoom: 14,
      });
    }

    const map = mapRef.current;

    // 2. 기존 마커 및 선 초기화 (Clean up)
    markerLayerRef.current.forEach((marker) => marker.setMap(null));
    markerLayerRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (list.length === 0) return;

    // 3. 마커 생성 및 경로 좌표 수집
    const pathPoints = [];
    const bounds = new window.Tmapv2.LatLngBounds();

    list.forEach((res, index) => {
      const lat = Number(res.lat);
      const lng = Number(res.lng);
      if (!lat || !lng) return;

      const position = new window.Tmapv2.LatLng(lat, lng);
      pathPoints.push(position);
      bounds.extend(position);

      // 숫자 배지가 포함된 마커 생성
      const marker = new window.Tmapv2.Marker({
        position: position,
        map: map,
        title: res.restName,
        label: `<span style="background-color: #007bff; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: bold;">${index + 1}</span>`,
      });

      markerLayerRef.current.push(marker);
    });

    // 4. 방문 순서대로 선(Polyline) 연결
    if (pathPoints.length > 1) {
      polylineRef.current = new window.Tmapv2.Polyline({
        path: pathPoints,
        strokeColor: "#FF5733",
        strokeWeight: 4,
        strokeStyle: "solid",
        map: map,
      });
    }

    // 5. 모든 마커가 보이도록 뷰포트 조정
    if (pathPoints.length > 0) {
      map.fitBounds(bounds);
      if (pathPoints.length === 1) {
        map.setZoom(15);
      }
    }
  }, [list, width, height]); // 선택 리스트가 바뀌면 마커/선 재렌더링

  return (
    <div id="tmap_shared_container" style={{ width, height, minHeight }} />
  );
};

export default CourseMap;
