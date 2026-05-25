import styles from "./RestaurantView.module.css";

const RestaurantView = () => {
  return (
    <>
      <section className={styles.rest_info}>
        <div className={styles.btn_zone_info}>
          <button type="button">수정</button>
          <button type="button">삭제</button>
        </div>

        <RestaruntViewInfo />

        <div className={styles.btn_zone1}>
          <button type="button">신고</button>
          <button type="button">찜</button>
        </div>
      </section>
      <section className={styles.rest_reviews}>
        <div className={styles.btn_zone_reviews}>
          <button type="button">리뷰 작성하기</button>
        </div>

        <RestaruntViewReviews />
      </section>
    </>
  );
};

export default RestaurantView;
