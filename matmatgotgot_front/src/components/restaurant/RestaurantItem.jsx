import styles from "./RestaurantItem.module.css";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

// 이미지 URL 가공 헬퍼 함수
const getRestThumbUrl = (thumb) => {
  if (!thumb) return null;
  if (thumb.startsWith("http://") || thumb.startsWith("https://")) return thumb;
  
  // "basic.jpeg" 등 순수 파일명인 경우 S3 Full URL 경로 결합
  const cleanPath = thumb.startsWith("/") ? thumb.slice(1) : thumb;
  return `https://d2lg74d5mqmhqe.cloudfront.net/app/upload/web/matgot/menu/${cleanPath}`;
};

const RestaurantItem = ({ rest }) => {
  const navigate = useNavigate();

  // 전달받은 rest.restThumb 주소 변환
  const thumbUrl = getRestThumbUrl(rest?.restThumb);

  return (
    <div
      className={styles.card}
      onClick={() => {
        navigate(`/rest/view/${rest?.restNo}`);
      }}
    >
      <div className={styles.restaurant_item}>
        <div className={styles.name_like}>
          <div className={styles.rest_name}>{rest?.restName}</div>
          <div className={styles.like}>
            {rest?.isLike ? (
              <FavoriteIcon className={styles.favorite_icon} />
            ) : (
              <FavoriteBorderIcon className={styles.favorite_icon} />
            )}
          </div>
        </div>
        <div className={styles.rest_img}>
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={rest?.restName || "식당 썸네일"}
              onError={(e) => {
                // 이미지 로드 실패 시(404 등) 엑박 대신 안 보이게 처리
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <ImageNotSupportedIcon className={styles.ImageNotSupportedIcon} />
          )}
        </div>
        <div className={styles.rest_addr}>{rest?.restAddr}</div>
        <div className={styles.reset_category}>{rest?.category}</div>
      </div>
      <div className={styles.like_reviews}>
        <div className={styles.review_count}>
          리뷰수 {rest?.reviewTotalCount}
        </div>
        <div className={styles.star}>★ {rest?.ratingAvg ?? 0}</div>
      </div>
    </div>
  );
};

export default RestaurantItem;