import { useEffect, useState } from "react";
import styles from "./RestaurantMain.module.css";
import axios from "axios";

const RestaurantMain = () => {
  const [localList, setLocalList] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/local`)
      .then((res) => {
        setLocalList(res.dtaa);
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

      <section className={styles.local_card_wrap}>
        <div>현지인 맛집</div>
        <div className={styles.restaurant_card}>
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

      <section className={styles.btn_zone_bot}>
        <div className={styles.regist_btn}>
          <button type="button">맛집 등록</button>
        </div>
      </section>
    </>
  );
};

export default RestaurantMain;
