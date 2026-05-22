import styles from "./RestaurantItem.module.css";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

const RestaurantItem = ({ rest }) => {
  return (
    <>
      <div className={styles.restaurant_item}>
        <div className={styles.rest_name}>맛집 상호명</div>
        <div className={styles.rest_img}>
          <ImageNotSupportedIcon className={styles.ImageNotSupportedIcon} />
        </div>
        <div className={styles.rest_addr}>맛곳광역시 맛곳구 맛곳동</div>
        <div className={styles.reset_category}>중식당</div>
      </div>
      <div className={styles.like_star}>
        <div className={styles.like}>좋아요</div>
        <div className={styles.star}>* 5.0</div>
      </div>
    </>
  );
};

export default RestaurantItem;

// {market.marketThumb ? (
//           <img
//             src={`${import.meta.env.VITE_IMAGE_SERVER}/${market.marketThumb}`}
//             alt={market.marketTitle}
//           />
//         ) : (
//           <ImageNotSupportedIcon
//             className={styles.ImageNotSupportedIcon}
//             style={{ height: "200px", width: "200px", fill: "var(--primary)" }}
//           />
//         )}

// rest_no BIGINT AUTO_INCREMENT PRIMARY KEY,
//     member_no BIGINT NOT NULL,
//     rest_name VARCHAR(100) NOT NULL,
//     address VARCHAR(255) NOT NULL,
//     lat DOUBLE NOT NULL,	-- 위도
//     lng DOUBLE NOT NULL,	-- 경도
//     category VARCHAR(50) NOT NULL,
//     phone VARCHAR(20),
//     hours VARCHAR(100),
//     avg_rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
//     review_total_count INT NOT NULL DEFAULT 0,
//     local_review_count INT NOT NULL DEFAULT 0,
//     content TEXT NOT NULL,
//     ai_review TEXT,
//     rest_status TINYINT UNSIGNED NOT NULL DEFAULT 0 CHECK (rest_status IN (0,1)),	-- 0: 정상 / 1: 숨김
//     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
