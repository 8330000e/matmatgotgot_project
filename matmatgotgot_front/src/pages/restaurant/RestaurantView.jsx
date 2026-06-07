import { useState, useEffect } from "react"; // useEffect 추가
import axios from "axios"; // axios 추가
import RestaruntViewInfo from "../../components/restaurant/RestaruntViewInfo";
import RestaruntViewReviews from "../../components/restaurant/RestaruntViewReviews";
import styles from "./RestaurantView.module.css";
import { useParams } from "react-router-dom";
import ReportModal from "../../components/ui/ReportModal";

const RestaurantView = () => {
  const [restView, setRestView] = useState(null);
  const { restNo } = useParams();
  const [reportModal, setReportModal] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // 맛집 상세 정보 조회
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants?restNo=${restNo}`)
      .then((res) => {
        console.log(res.data);
        setRestView(res.data);
        setLiked(res.data.isLike);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likeToggle = () => {
    console.log("liked: ", liked);
    if (!liked) {
      axios
        .patch(
          `${import.meta.env.VITE_BACKSERVER}/restaurants/rest/like?restNo=${restNo}`,
        )
        .then((res) => {
          console.log(res.data);
          setLiked((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .delete(
          `${import.meta.env.VITE_BACKSERVER}/restaurants/rest/unlike?restNo=${restNo}`,
        )
        .then((res) => {
          console.log(res.data);
          setLiked((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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

        <div className={styles.btn_zone1}>
          <button
            type="button"
            className={styles.report_btn}
            onClick={() => setReportModal(true)}
          >
            신고
          </button>
          <button
            type="button"
            className={`${styles.like_btn} ${liked ? styles.liked : ""}`}
            onClick={likeToggle}
          >
            찜
          </button>
        </div>
      </section>

      {/* ===== 리뷰 영역 ===== */}
      <section className={styles.rest_reviews}>
        <RestaruntViewReviews restNo={restNo} />
      </section>

      {reportModal && (
        <div
          className={styles.modal_overlay}
          onClick={(e) => {
            e.stopPropagation();
            setReportModal(false);
          }}
        >
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            <ReportModal
              type={"rest"}
              no={restNo}
              setReportModal={setReportModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantView;
