import { useState, useEffect } from "react"; // useEffect 추가
import axios from "axios"; // axios 추가
import RestaruntViewInfo from "../../components/restaurant/RestaruntViewInfo";
import RestaruntViewReviews from "../../components/restaurant/RestaruntViewReviews";
import styles from "./RestaurantView.module.css";
import { useNavigate, useParams } from "react-router-dom";
import ReportModal from "../../components/ui/ReportModal";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/useAuthStore";

const RestaurantView = () => {
  const [restView, setRestView] = useState(null);
  const { restNo } = useParams();
  const [reportModal, setReportModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  // 로그인 정보
  const { memberNo, memberId } = useAuthStore();
  const isLoggedIn = !!memberNo;

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

  // 작성자 본인 여부 (맛집 데이터 로드 후 판단)
  const isOwner = isLoggedIn && restView && memberId === restView.memberId;

  const likeToggle = () => {
    if (!isLoggedIn) {
      Swal.fire({ title: "로그인이 필요합니다.", icon: "warning" });
      return;
    }
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
        {/* 수정 / 삭제 버튼 — 로그인 + 본인 작성 글일 때만 표시 */}
        {isOwner && (
          <div className={styles.btn_zone_info}>
            <button
              type="button"
              onClick={() => {
                navigate(`/rest/modify/${restNo}`);
              }}
            >
              수정
            </button>
            <button type="button">삭제</button>
          </div>
        )}

        {restView && <RestaruntViewInfo restView={restView} />}

        <div className={styles.btn_zone1}>
          <button
            type="button"
            className={styles.report_btn}
            onClick={() => {
              if (!isLoggedIn) {
                Swal.fire({ title: "로그인이 필요합니다.", icon: "warning" });
                return;
              }
              setReportModal(true);
            }}
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
