import styles from "./RestaruntViewReviews.module.css";
import Pagination from "../../components/ui/Pagination";
import { useEffect, useState } from "react";
import axios from "axios";

const RestaruntViewReviews = () => {
  const [reviewList, setRivewList] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(4); // 한 페이지에 보여줄 리뷰 수
  const [totalPage, setTotalPage] = useState(null);

  useEffect(() => {
    // 리뷰 목록 조회
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/reviews?restNo=1`)
      .then((res) => {
        // setRivewList(res.data.list);
        // setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategories([...categories, value]);
    } else {
      setCategories(categories.filter((item) => item !== value));
    }
  };

  return (
    <>
      {/* 리뷰 수 헤더 */}
      <div className={styles.review_top}>
        <div className={styles.review_count}>리뷰 수 24개</div>
        <div className={styles.btn_zone_reviews}>
          <button type="button">리뷰 작성하기</button>
        </div>
      </div>

      {/* 리뷰 카드 그리드 (2열) */}
      <div className={styles.review_wrap}>
        {reviewList.map((review) => (
          <ReviewItem key={review.reviewNo} review={review} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className={styles.pagination_wrap}>
        <Pagination
          totalPage={totalPage}
          page={page}
          setPage={setPage}
          naviSize={5}
        />
      </div>
    </>
  );
};

// props 구조분해 수정: (review) → ({ review })
const ReviewItem = ({ review }) => {
  return (
    <div className={styles.review_item}>
      {/* 작성자 정보: 아바타 + 이름 + 현지인 뱃지 + 별점 */}
      <div className={styles.review_writer}>
        {/* 프로필 이미지: 없으면 기본 회색 원 표시 */}
        <div
          className={`${styles.member_thumb} ${review.memberThumb ? styles.thumb_exists : styles.thumb_default}`}
        >
          {review.memberThumb && (
            <img
              src={`${import.meta.env.VITE_BACKSERVER}/member/thumb/${review.memberThumb}`}
              alt="프로필 이미지"
            />
          )}
        </div>

        <div className={styles.writer_info}>
          {/* 이름 + 현지인 뱃지 행 — 현지인 뱃지 추가 */}
          <div className={styles.name_badge_row}>
            <span className={styles.member_name}>{review.memberName}</span>
            {/* 현지인 여부에 따라 뱃지 표시 (memberType 등 실제 필드명에 맞게 조정) */}
            {review.isLocal && (
              <span className={styles.member_badge}>현지인</span>
            )}
          </div>
          {/* 별점: **** → ★★★★★ (실제 별점으로 변환 예정) */}
          <div className={styles.review_rating}>★★★★★</div>
        </div>
      </div>

      {/* 리뷰 본문 */}
      <div className={styles.review_content}>{review.reviewContent}</div>

      {/* 날짜 + 메뉴 */}
      <div className={styles.review_meta}>
        <span className={styles.review_date}>{review.reviewDate}</span>
        {/* "메뉴: " 접두어 추가 */}
        <span className={styles.review_menu}>메뉴: {review.reviewMenu}</span>
      </div>
    </div>
  );
};

export default RestaruntViewReviews;
