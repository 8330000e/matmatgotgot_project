import styles from "./RestaurantItem.module.css";

const RestaurantItem = ({ rest }) => {
  return (
    <>
      <div className={styles.restaurant_item}>
        <div className={styles.rest_name}>{`${rest.resetName}`}</div>
      </div>
    </>
  );
};

export default RestaurantItem;

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
