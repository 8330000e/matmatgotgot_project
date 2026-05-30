import { useEffect, useRef } from "react"; // useEffect, useRef 추가
import styles from "./RestaruntViewInfo.module.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const RestaruntViewInfo = ({ restView }) => {
  const mapDivRef = useRef(null);

  useEffect(() => {
    if (!mapDivRef.current || !window.naver) return;

    const center = new naver.maps.LatLng(restView.lat, restView.lng);

    const map = new naver.maps.Map(mapDivRef.current, {
      center,
      zoom: 18,
    });

    const marker = new naver.maps.Marker({ position: center, map });

    const infoWindow = new naver.maps.InfoWindow({
      content: `${restView.restName} [${restView.restAddr}]`,
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
      <section className={styles.info1}>
        {/* 상호명 */}
        <div className={styles.name_addr}>
          <div className={styles.rest_name}>{`${restView.restName}`}</div>
          <span className={styles.rest_addr}>{`${restView.restAddr}`}</span>
        </div>

        <div className={styles.rest_meta}>
          {/* 좌측: 주소 + 카테고리 + 태그 */}
          <div className={styles.meta_left}>
            <div className={styles.cateogry}>
              <span className={styles.cattag}>category </span>
              <span className={styles.tag_item}>{restView.category}</span>
            </div>
            <div className={styles.tags}>
              <span className={styles.cattag}>tags </span>
              {restView.tags?.map((tag, idx) => (
                <span key={idx} className={styles.tag_item}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 우측: 평점 + 영업시간 + 전화번호 */}
          <div className={styles.meta_right}>
            <div className={styles.avg_rating}>
              <span className={styles.stars}>★</span>
              <span>{restView.ratingAvg}</span>
            </div>
            <div className={styles.hours}>
              <AccessTimeIcon className={styles.meta_icon} />
              <span>{restView.hours}</span>
            </div>
            <div className={styles.phone}>
              <LocalPhoneIcon className={styles.meta_icon} />
              <span>{restView.phone}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== info2: 본문 내용 (HTML 렌더링) ===== */}
      <section className={styles.info2}>
        <div
          className={styles.content}
          /* 본문이 없을 때 placeholder 표시 */
          dangerouslySetInnerHTML={{
            __html: restView?.restContent || "맛집 본문 내용",
          }}
        />
      </section>

      {/* ===== info3: ai 리뷰 총평 + 리뷰된 메뉴 (좌) / 지도 (우) ===== */}
      <section className={styles.info3}>
        {/* 좌측: AI 총평(상단) → 리뷰된 메뉴(하단) — 이미지 기준 순서 */}
        <div className={styles.menu_ai_side}>
          {/* ai 리뷰 총평 섹션 */}
          <div className={styles.ai_section}>
            <div className={styles.section_title}>ai 리뷰 총평</div>
            {/* AI 총평 내용 박스: 서버 데이터 수신 전 빈 박스 표시 */}
            <div className={styles.ai_content}>{restView.aiReview}</div>
          </div>

          {/* 리뷰된 메뉴 섹션 */}
          <div className={styles.reviewed_menu_section}>
            <div className={styles.section_title}>리뷰된 메뉴</div>
            <div className={styles.reviewd_menu}>
              {restView.menus.map((menu, idx) => (
                <span key={idx} className={styles.menu_item}>
                  {menu}
                </span>
              ))}
            </div>
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
