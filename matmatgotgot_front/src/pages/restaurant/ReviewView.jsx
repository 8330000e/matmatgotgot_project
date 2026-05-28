import styles from "./ReviewView.module.css";

const ReviewView = () => {
  return (
    <>
      <section className={styles.review_info}>
        <div className={styles.btn_zone_info}>
          <button type="button">수정</button>
          <button type="button">삭제</button>
        </div>

        <ReviewViewInfo />

        <div className={styles.btn_zone}>
          <div className={styles.btn_zone1}>
            <button type="button">신고</button>
            <button type="button">좋아요</button>
          </div>
          <div className={styles.btn_zone2}>
            <button type="button">맛집 상세보기</button>
          </div>
        </div>
      </section>
      <section className={styles.review_comment}>
        <div>댓글</div>
        <ReviewViewComment />
      </section>
    </>
  );
};

export default ReviewView;
