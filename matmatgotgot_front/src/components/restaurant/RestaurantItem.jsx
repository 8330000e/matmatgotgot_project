import styles from "./RestaurantItem.module.css";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import FavoriteIcon from "@mui/icons-material/Favorite";

const RestaurantItem = ({ rest }) => {
  return (
    <div className={styles.card}>
      <div className={styles.restaurant_item}>
        <div className={styles.rest_name}>맛집 상호명</div>
        <div className={styles.rest_img}>
          <ImageNotSupportedIcon className={styles.ImageNotSupportedIcon} />
        </div>
        <div className={styles.rest_addr}>맛곳광역시 맛곳구 맛곳동</div>
        <div className={styles.reset_category}>중식당</div>
      </div>
      <div className={styles.like_star}>
        <div className={styles.like}>
          <FavoriteIcon className={styles.favorite_icon} />
        </div>
        {/* 리뷰 수: 데이터 없으면 생략 */}
        {rest?.reviewCount != null && (
          <div className={styles.review_count}>리뷰수 {rest.reviewCount}</div>
        )}
        <div className={styles.star}>★ {rest?.starAvg ?? 5.0}</div>
      </div>
    </div>
  );
};

export default RestaurantItem;
