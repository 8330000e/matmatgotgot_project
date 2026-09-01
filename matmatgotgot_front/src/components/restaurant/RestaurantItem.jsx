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
        const response = await axios.get('/api/restaurants/main');

        // response.data.list 가 배열인지 확인 후 map 실행
        const rawList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.list || []);

        const formattedList = rawList.map((rest) => ({
          ...rest,
          restThumb: rest.restThumb
            ? (rest.restThumb.startsWith("http")
                ? rest.restThumb
                : `https://d2lg74d5mqmhqe.cloudfront.net/app/upload/web/matgot/menu/${rest.restThumb}`)
            : null,
        }));

        setRestaurantList(formattedList);
        
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
