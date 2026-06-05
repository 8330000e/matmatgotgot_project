import styles from "./RestaurantItem.module.css";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import FavoriteIcon from "@mui/icons-material/Favorite";

const RestaurantItem = ({ rest }) => {
  return (
    <div className={styles.card}>
      <div className={styles.restaurant_item}>
        <div className={styles.name_like}>
          <div className={styles.rest_name}>{rest.restName}</div>
          <div className={styles.like}>
            <FavoriteIcon className={styles.favorite_icon} />
          </div>
        </div>
        <div className={styles.rest_img}>
          {rest.restThumb ? (
            <img src={rest.restThumb} />
          ) : (
            <ImageNotSupportedIcon className={styles.ImageNotSupportedIcon} />
          )}
        </div>
        <div className={styles.rest_addr}>{rest.restAddr}</div>
        <div className={styles.reset_category}>{rest.category}</div>
      </div>
      <div className={styles.like_reviews}>
        <div className={styles.review_count}>
          리뷰수 {rest.reviewTotalCount}
        </div>
        <div className={styles.star}>★ {rest?.ratingAvg ?? 5.0}</div>
      </div>
    </div>
  );
};

export default RestaurantItem;
