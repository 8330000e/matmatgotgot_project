import styles from "./RestaruntViewInfo.module.css";

const RestaruntViewInfo = () => {
  const mapDivRef = useRef(null);

  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return null;
    }

    const center = new naver.maps.LatLng(37.5696734, 126.9843022);

    const map = new naver.maps.Map(mapDivRef.current, {
      center: center,
      zoom: 18,
    });

    const marker = new naver.maps.Marker({
      position: center,
      map: map,
    });

    const infoWindow = new naver.maps.InfoWindow({
      content: "<h3>KH정보교육원</h3>",
    });

    naver.maps.Event.addListener(marker, "click", () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });

    naver.maps.Event.addListener(map, "click", (e) => {
      map.setCenter(e.coord);

      if (infoWindow.getMap()) {
        infoWindow.close();
      }
    });
  }, []);

  return (
    <>
      <section className={styles.info1}>
        <div>맛집 상호명</div>
        <div>
          <div>서울시 종로구 권철동</div>
          <div>한식</div>
          <div className={styles.tags}>
            <div>야외석</div>
            <div>분위기</div>
            <div>혼밥</div>
          </div>
          <div className={styles.avg_rating}>4.8</div>
          <div className={styles.hours}>10:00 ~ 22:20</div>
          <div className={styles.phone}>02-1234-5678</div>
        </div>
      </section>

      <section className={styles.info2}>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: board.boardContent }}
        ></div>
      </section>

      <section className={styles.info3}>
        <div className={styles.menu_ai_side}>
          <div className={styles.reviewd_menu}>
            <div>라면</div>
            <div>김밥</div>
            <div>돈까스</div>
          </div>
        </div>
        <div className={styles.map_side}>
          <div className={styles.map_div} ref={mapDivRef} />
        </div>
      </section>
    </>
  );
};

export default RestaruntViewInfo;
