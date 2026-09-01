import styles from "./RestaurantItem.module.css";
import axios from "axios";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const RestaurantItem = ({ rest }) => {
  const navigate = useNavigate();

  const [restaurantList, setRestaurantList] = useState([]);

  useEffect(() => {
    // 3. async 함수 정의
    const fetchRestaurants = async () => {
      try {
        const CLOUDFRONT_URL = "https://d2lg74d5mqmhqe.cloudfront.net";
        const S3_PATH_PREFIX = "app/upload/web/matgot/menu"; // 👈 S3 실제 경로

        // API 응답 데이터를 받아서 state에 저장할 때
        const formattedList = response.data.map((item) => {
          let imgUrl = item.imgName || item.tplanThumb || item.restThumb;

          if (!imgUrl) {
            imgUrl = null; // 이미지 없을 경우
          } else if (!imgUrl.startsWith("http")) {
            // 순수 파일명(basic.jpeg 등)만 있는 경우 CloudFront Full URL로 변환
            const cleanPath = imgUrl.startsWith("/") ? imgUrl.slice(1) : imgUrl;
            imgUrl = `${CLOUDFRONT_URL}/${S3_PATH_PREFIX}/${cleanPath}`;
          }

          return {
            ...item,
            restThumb: imgUrl,
          };
        });
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        // 필요하다면 위에서 선언한 navigate를 여기서 사용
        // navigate('/error'); 
      }
    };

    fetchRestaurants();
  }, []); // useEffect 끝

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
        <div className={styles.star}>★ {rest?.ratingAvg ?? 0}</div>
      </div>
    </div>
  );
};

export default RestaurantItem;
