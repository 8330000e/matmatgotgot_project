import styles from "./RestaruntViewInfo.module.css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const ReviewViewInfo = () => {
  const [review, setReview] = useState(null);

  return (
    <>
      <div className={styles.writer_info}>
        <div className={styles.review_writer}>
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
          <div className={styles.name_badge_row}>
            <span className={styles.member_name}>{review.memberName}</span>
            {review.isLocal && (
              <span className={styles.member_badge}>현지인</span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.photo_swiper}></div>
      <div className={styles.content}>
        국물이 진하고 면발이 쫄깃해서 자주 찾는 단골 맛집이에요. 야외석에 앉아서
        먹으면 날씨 좋은 날 특히 더 맛있습니다. 수제비 하나에 파전까지 시키면
        배부르게 먹을 수 있어요 조용한 동네 분위기라 데이트나 가족 나들이에도
        좋아요!
      </div>
      <div className={styles.tags}>
        <span className={styles.tag_item}>야외석</span>
        <span className={styles.tag_item}>국물</span>
        <span className={styles.tag_item}>분위기</span>
      </div>
      <div className={styles.review_meta}>
        <div>
          <p>방문일</p>
          <p>2026년 5월 5일</p>
        </div>
        <div>
          <p>메뉴</p>
          <p>수제비, 파전, 막러리</p>
        </div>
        <div>
          <p>별점</p>
          <p>****</p>
        </div>
      </div>
    </>
  );
};

export default ReviewViewInfo;
