import { useState, useEffect } from "react"; // useEffect 추가
import axios from "axios"; // axios 추가
import RestaruntViewInfo from "../../components/restaurant/RestaruntViewInfo";
import RestaruntViewReviews from "../../components/restaurant/RestaruntViewReviews";
import styles from "./RestaurantView.module.css";
import { useParams } from "react-router-dom";

const RestaurantView = () => {
  const [restView, setRestView] = useState(null);
  const { restNo } = useParams();

  useEffect(() => {
    // 맛집 상세 정보 조회
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants?restNo=${restNo}`)
      .then((res) => {
        console.log(res.data);
        setRestView(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.wrap}>
      {/* ===== 맛집 정보 영역 ===== */}
      <section className={styles.rest_info}>
        {/* 수정 / 삭제 버튼 (우상단) */}
        <div className={styles.btn_zone_info}>
          <button type="button">수정</button>
          <button type="button">삭제</button>
        </div>

        {restView && <RestaruntViewInfo restView={restView} />}

        {/* 신고 / 찜 버튼 (좌하단) */}
        <div className={styles.btn_zone1}>
          <button type="button">신고</button>
          <button type="button">찜</button>
        </div>
      </section>

      {/* ===== 리뷰 영역 ===== */}
      <section className={styles.rest_reviews}>
        <RestaruntViewReviews restNo={restNo} />
      </section>
    </div>
  );
};

export default RestaurantView;
