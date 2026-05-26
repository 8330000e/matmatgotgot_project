import { useEffect, useState } from "react";
import styles from "./Restaurant.module.css";
import axios from "axios";
import RestaurantItem from "../../components/restaurant/RestaurantItem";

const RestaurantMain = () => {
  const [localList, setLocalList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [regionList, setRegionList] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/local`)
      .then((res) => {
        setLocalList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/popular`)
      .then((res) => {
        setPopularList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/like`)
      .then((res) => {
        setLikeList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/region`)
      .then((res) => {
        setRegionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <section className={styles.btn_zone_top}>
        <div className={styles.detail_btn}>
          <button type="button">상세 검색</button>
        </div>
      </section>

      <section className={styles.card_wrap}>
        <div>현지인 맛집</div>
        <div className={styles.restaurant_card}>
          {/* localList에서 8개의 rest 정보를 가지고 온다고 할 때 화면에는 4개의 RestaurantItem을 보여주고 오른쪽, 왼쪽 방향을 누르면 swipe 되도록 하기 */}
          {localList.map((rest) => {
            return (
              <RestaurantItem
                key={`${rest.restNo}`}
                rest={rest}
              ></RestaurantItem>
            );
          })}
        </div>
      </section>
      <section className={styles.card_wrap}>
        <div>인기 맛집</div>
        <div className={styles.restaurant_card}>
          {/* popularList에서 8개의 rest 정보를 가지고 온다고 할 때 화면에는 4개의 RestaurantItem을 보여주고 오른쪽, 왼쪽 방향을 누르면 swipe 되도록 하기 */}
          {popularList.map((rest) => {
            return (
              <RestaurantItem
                key={`${rest.restNo}`}
                rest={rest}
              ></RestaurantItem>
            );
          })}
        </div>
      </section>
      <section className={styles.card_wrap}>
        <div>찜한 맛집</div>
        <div className={styles.restaurant_card}>
          {/* likeList에서 8개의 rest 정보를 가지고 온다고 할 때 화면에는 4개의 RestaurantItem을 보여주고 오른쪽, 왼쪽 방향을 누르면 swipe 되도록 하기 */}
          {likeList.map((rest) => {
            return (
              <RestaurantItem
                key={`${rest.restNo}`}
                rest={rest}
              ></RestaurantItem>
            );
          })}
        </div>
      </section>
      <section className={styles.card_wrap}>
        <div>내 주변 맛집</div>
        <div className={styles.restaurant_card}>
          {/* regionList에서 8개의 rest 정보를 가지고 온다고 할 때 화면에는 4개의 RestaurantItem을 보여주고 오른쪽, 왼쪽 방향을 누르면 swipe 되도록 하기 */}
          {regionList.map((rest) => {
            return (
              <RestaurantItem
                key={`${rest.restNo}`}
                rest={rest}
              ></RestaurantItem>
            );
          })}
        </div>
      </section>

      <section className={styles.btn_zone_bot}>
        <div className={styles.regist_btn}>
          <button type="button">맛집 등록</button>
        </div>
      </section>
    </>
  );
};

export default RestaurantMain;
