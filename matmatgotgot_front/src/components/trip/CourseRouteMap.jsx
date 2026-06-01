import React, { useMemo } from "react";
import styles from "./CourseRouteMap.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const CourseRouteMap = ({ routes: propsRoutes }) => {
  // 1. Props로 전달받은 데이터가 있으면 사용하고, 없으면 내부 더미 데이터를 사용합니다.
  const defaultRoutes = [
    { id: 1, name: "강된장 쌈밥" },
    { id: 2, name: "홍원돈까스" },
    { id: 3, name: "황소고집" },
  ];

  const routes = propsRoutes || defaultRoutes;
  const totalItems = routes.length;

  // 2. SVG 내부에서 각 가상의 지점(마커) 좌표를 계산합니다.
  // 가로폭 500, 세로폭 120 안에서 노드 개수에 따라 등분합니다.
  const width = 500;
  const height = 120;
  const paddingX = 40;

  const points = useMemo(() => {
    if (totalItems === 0) return [];
    if (totalItems === 1) return [{ x: width / 2, y: height / 2 }];

    return routes.map((_, index) => {
      // X축은 일정하게 간격 분배
      const x = paddingX + ((width - paddingX * 2) / (totalItems - 1)) * index;

      // Y축은 리드미컬하게 위아래로 출렁이는 귀여운 곡선 배치 (벌의 비행 느낌)
      // 인덱스가 홀수일 때와 짝수일 때 높낮이를 다르게 줍니다.
      let y = height / 2;
      if (totalItems > 2) {
        y = index % 2 === 0 ? height / 2 - 20 : height / 2 + 20;
      }
      return { x, y };
    });
  }, [totalItems]);

  // 3. 계산된 좌표들을 부드러운 Cubic Bezier(큐빅 베지에) 곡선 SVG Path로 연결합니다.
  const pathD = useMemo(() => {
    if (points.length < 2) return "";

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];

      // 앞뒤 지점의 중간 제어점을 잡아서 부드러운 S자/ㄹ자 곡선을 형성
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;

      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  return (
    <div className={styles.routeMapContainer}>
      <svg className={styles.svgLayer} viewBox={`0 0 ${width} ${height}`}>
        {pathD && (
          <path
            d={pathD}
            className={styles.dashedPath}
            fill="none"
            stroke="#2b1b17"
            strokeWidth="3"
            strokeDasharray="6,6"
          />
        )}
      </svg>

      <div className={styles.nodesOverlay}>
        {points.map((point, index) => {
          const route = routes[index];
          return (
            <div
              key={route.id}
              className={styles.nodeItem}
              style={{
                left: `${(point.x / width) * 100}%`,
                top: `${(point.y / height) * 100}%`,
              }}
            >
              <div className={styles.markerWrapper}>
                <LocationOnIcon className={styles.pinIcon} />
                <span className={styles.markerNumber}>{index + 1}</span>
              </div>

              <div className={styles.balloonName}>{route.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseRouteMap;
