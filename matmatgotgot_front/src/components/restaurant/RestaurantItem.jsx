import styles from "./RestaurantItem.module.css";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

const RestaurantItem = ({ rest }) => {
  const navigate = useNavigate();

  const S3_BASE_URL = "https://d2lg74d5mqmhqe.cloudfront.net";
  // S3 버킷 내부의 실제 Prefix 경로 지정
  const IMAGE_PREFIX = "app/upload/web/matgot"; 

  const getImageUrl = (path) => {
    if (!path) return `${S3_BASE_URL}/${IMAGE_PREFIX}/menu/default_thumbnail.png`;
    
    // 이미 Full URL 형태인 경우
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // 앞쪽 슬래시 정리 후 S3 Prefix 결합
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${S3_BASE_URL}/${IMAGE_PREFIX}/${cleanPath}`;
  };

  return (
    <div
      className={styles.card}
      onClick={() => {
        navigate(`/rest/view/${rest.restNo}`);
      }}
    >
      <div className={styles.restaurant_item}>
        <div className={styles.name_like}>
          <div className={styles.rest_name}>{rest.restName}</div>
          <div className={styles.like}>
            {rest.isLike ? (
              <FavoriteIcon className={styles.favorite_icon} />
            ) : (
              <FavoriteBorderIcon className={styles.favorite_icon} />
            )}
          </div>
        </div>
        <div className={styles.rest_img}>
          {rest.restThumb ? (
            <img 
              src={getImageUrl(rest.restThumb)}
              alt="메뉴 이미지"
              onError={(e) => {
                e.currentTarget.onerror = null; // 무한 루프 방지
                e.currentTarget.src = "/default_thumbnail.png";
              }}
            />
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
        <div className={styles.star}>★ {rest?.ratingAvg ?? 0}</div>
      </div>
    </div>
  );
};

export default RestaurantItem;
