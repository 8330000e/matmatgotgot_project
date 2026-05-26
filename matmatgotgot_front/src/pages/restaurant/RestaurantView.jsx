import { useState, useEffect } from "react"; // useEffect 추가
import axios from "axios"; // axios 추가
import RestaruntViewInfo from "../../components/restaurant/RestaruntViewInfo";
import RestaruntViewReviews from "../../components/restaurant/RestaruntViewReviews";
import styles from "./RestaurantView.module.css";

const RestaurantView = () => {
  const [reviewList, setRivewList] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(4); // 한 페이지에 보여줄 리뷰 수
  const [totalPage, setTotalPage] = useState(null);
  const [restView, setRestView] = useState(null);

  useEffect(() => {
    // 맛집 상세 정보 조회
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/view`)
      .then((res) => {
        setRestView(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // 리뷰 목록 조회
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/reviews`)
      .then((res) => {
        setRivewList(res.data.list);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {/* ===== 맛집 정보 영역 ===== */}
      <section className={styles.rest_info}>
        {/* 수정 / 삭제 버튼 (우상단) */}
        <div className={styles.btn_zone_info}>
          <button type="button">수정</button>
          <button type="button">삭제</button>
        </div>

        <RestaruntViewInfo restView={restView} />

        {/* 신고 / 찜 버튼 (좌하단) */}
        <div className={styles.btn_zone1}>
          <button type="button">신고</button>
          <button type="button">찜</button>
        </div>
      </section>

      {/* ===== 리뷰 영역 ===== */}
      <section className={styles.rest_reviews}>
        <RestaruntViewReviews
          reviewList={reviewList}
          page={page}
          size={size}
          totalPage={totalPage}
          setPage={setPage}
        />
      </section>
    </>
  );
};

export default RestaurantView;
