import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ReviewView.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import ReviewViewInfo from "../../components/restaurant/ReviewViewInfo";
import ReviewViewComment from "../../components/restaurant/ReviewViewComment";
import ReportModal from "../../components/ui/ReportModal";

// useAuthStore import 필요 — 실제 프로젝트 경로에 맞게 조정
// import { useAuthStore } from "../../store/authStore";

const ReviewView = () => {
  const { reviewNo } = useParams();
  const navigate = useNavigate();
  const [reportModal, setReportModal] = useState(false);

  // 로그인한 회원 번호 (본인 여부 확인용)
  // const { memberId: loginMemberNo } = useAuthStore();

  // 리뷰 상세 데이터 (서버에서 fetching)
  const [review, setReview] = useState(null);

  // 좋아요 토글 상태
  const [liked, setLiked] = useState(false);

  // 리뷰 데이터 조회
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/restaurants/review?reviewNo=${reviewNo}`,
      )
      .then((res) => {
        console.log(res.data);
        setReview(res.data);
        setLiked(res.data.isLiked);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewNo]);

  // 리뷰 삭제
  const deleteReview = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "삭제 후 복구할 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/restaurants/review/${reviewNo}`,
          )
          .then(() => navigate(-1)) // 이전 페이지로 이동
          .catch((err) => console.log(err));
      }
    });
  };

  const likeToggle = () => {
    if (liked) {
      axios
        .patch(
          `${import.meta.env.VITE_BACKSERVER}/restaurants/review/like?reviewNo=${reviewNo}`,
        )
        .then((res) => {
          setLiked((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .patch(
          `${import.meta.env.VITE_BACKSERVER}/restaurants/review/unlike?reviewNo=${reviewNo}`,
        )
        .then((res) => {
          setLiked((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // 본인 리뷰 여부 (수정/삭제 버튼 표시 조건)
  // const isOwner = review && loginMemberNo === review.memberNo;
  const isOwner = true; // 임시: 항상 버튼 표시 (authStore 연동 후 위 줄로 교체)

  // 로딩 중 (review 미수신 시 렌더링 생략)
  if (!review) return null;

  return (
    <div className={styles.page_wrap}>
      {/* ======= 리뷰 상세 섹션 ======= */}
      <section className={styles.review_info}>
        {/* ── 수정 / 삭제 버튼 (본인만 표시) ── */}
        {isOwner && (
          <div className={styles.btn_zone_info}>
            <button
              type="button"
              className={styles.info_btn}
              onClick={() => navigate(`/review/modify/${reviewNo}`)}
            >
              수정
            </button>
            <button
              type="button"
              className={styles.info_btn}
              onClick={deleteReview}
            >
              삭제
            </button>
          </div>
        )}

        {/* ── 리뷰 상세 정보 컴포넌트 ── */}
        <ReviewViewInfo review={review} />

        {/* ── 하단 버튼: 신고 / 좋아요 / 맛집 상세보기 ── */}
        <div className={styles.btn_zone}>
          {/* 왼쪽: 신고 + 좋아요 */}
          <div className={styles.btn_zone_left}>
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
              좋아요
            </button>
          </div>

          {/* 오른쪽: 맛집 상세보기 */}
          <div className={styles.btn_zone_right}>
            <button
              type="button"
              className={styles.detail_btn}
              onClick={() => {
                navigate(`/rest/view/${review.restNo}`);
              }}
            >
              맛집 상세 보기
            </button>
          </div>
        </div>
      </section>

      {/* ======= 댓글 섹션 ======= */}
      <section className={styles.review_comment}>
        <div className={styles.comment_title}>댓글</div>
        <ReviewViewComment reviewNo={reviewNo} />
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
              type={"review"}
              no={reviewNo}
              setReportModal={setReportModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewView;
