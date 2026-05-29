import { useEffect, useRef } from "react"; // useEffect, useRef 추가
import styles from "./RestaruntViewInfo.module.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // 영업시간 아이콘
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"; // 전화번호 아이콘

// props 구조분해 수정: (restView) → ({ restView })
const RestaruntViewInfo = ({ restView }) => {
  const mapDivRef = useRef(null);

  // 네이버 지도 초기화
  useEffect(() => {
    if (!mapDivRef.current || !window.naver) return;

    const center = new naver.maps.LatLng(37.5696734, 126.9843022);

    const map = new naver.maps.Map(mapDivRef.current, {
      center,
      zoom: 18,
    });

    const marker = new naver.maps.Marker({ position: center, map });

    const infoWindow = new naver.maps.InfoWindow({
      content: "<h3>KH정보교육원</h3>",
    });

    naver.maps.Event.addListener(marker, "click", () => {
      infoWindow.getMap() ? infoWindow.close() : infoWindow.open(map, marker);
    });

    naver.maps.Event.addListener(map, "click", (e) => {
      map.setCenter(e.coord);
      if (infoWindow.getMap()) infoWindow.close();
    });
  }, []);

  return (
    <>
      {/* ===== info1: 상호명 / 주소 / 카테고리 / 태그 / 평점 / 영업시간 / 전화번호 ===== */}
      <section className={styles.info1}>
        {/* 상호명 */}
        <div className={styles.name_addr}>
          <div className={styles.rest_name}>맛집 상호명</div>
          <span className={styles.rest_addr}>서울시 종로구 권철동</span>
        </div>

        {/* 메타 정보 행: 좌(주소·카테고리·태그) + 우(평점·시간·전화) */}
        <div className={styles.rest_meta}>
          {/* 좌측: 주소 + 카테고리 + 태그 */}
          <div className={styles.meta_left}>
            <div className={styles.cateogry}>
              <span>category </span>
              <span className={styles.tag_item}>한식</span>
            </div>
            <div className={styles.tags}>
              {/* 태그 아이템에 className 추가 */}
              <span>tags </span>
              <span className={styles.tag_item}>야외석</span>
              <span className={styles.tag_item}>분위기</span>
              <span className={styles.tag_item}>혼밥</span>
            </div>
          </div>

          {/* 우측: 평점 + 영업시간 + 전화번호 */}
          <div className={styles.meta_right}>
            <div className={styles.avg_rating}>
              <span className={styles.stars}>★★★★★</span>
              <span>4.8</span>
            </div>
            <div className={styles.hours}>
              <AccessTimeIcon className={styles.meta_icon} />
              <span>10:00~22:20</span>
            </div>
            <div className={styles.phone}>
              <LocalPhoneIcon className={styles.meta_icon} />
              <span>02-1234-5678</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== info2: 본문 내용 (HTML 렌더링) ===== */}
      <section className={styles.info2}>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: restView?.content }} // resetView → restView (오타 수정), optional chaining 추가
        />
      </section>

      {/* ===== info3: 리뷰된 메뉴 + ai 리뷰 총평 (좌) / 지도 (우) ===== */}
      <section className={styles.info3}>
        {/* 좌측: 메뉴 목록 + AI 총평 */}
        <div className={styles.menu_ai_side}>
          {/* ai 리뷰 총평 — 기존 JSX에 없던 섹션 추가 */}
          <div className={styles.ai_section}>
            <div className={styles.section_title}>ai 리뷰 총평</div>
            {/* AI 총평 내용: 서버에서 데이터 받아 표시 예정 */}
          </div>
        </div>

        {/* 우측: 네이버 지도 */}
        <div className={styles.map_side}>
          <div className={styles.map_div} ref={mapDivRef} />
        </div>
      </section>
    </>
  );
};

export default RestaruntViewInfo;
