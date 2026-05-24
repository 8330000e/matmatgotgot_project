import { useEffect, useState } from "react";
import styles from "./RestaurantDetailSearch.module.css";
import axios from "axios";
import RestaurantItem from "../../components/restaurant/RestaurantItem";
import Pagination from "../../components/ui/Pagination";

const RestaurantDetailSearch = () => {
  const [region, setRegion] = useState("");
  const [categories, setCategories] = useState([]);
  const [order, setOrder] = useState("");
  const [restList, setRestList] = useState([]);
  const [restName, setRestName] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPage, setTotalPage] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/restaurants/search`)
      .then((res) => {
        setRestList(res.data);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setCategories([...categories, value]);
    } else {
      setCategories(categories.filter((item) => item !== value));
    }
  };

  return (
    <>
      <section className={styles.filter_section}>
        <div>필터</div>
        <div className={styles.region}>
          <div>지역</div>
          <input
            type="text"
            name="region"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          ></input>
        </div>
        <div className={styles.category}>
          <div>카테고리</div>
          <div className={styles.ckbox}>
            <label>
              <input
                type="checkbox"
                value="kr"
                checked={categories.includes("kr")}
                onChange={handleCategoryChange}
              />
              한식
            </label>

            <label>
              <input
                type="checkbox"
                value="western"
                checked={categories.includes("western")}
                onChange={handleCategoryChange}
              />
              양식
            </label>

            <label>
              <input
                type="checkbox"
                value="jp"
                checked={categories.includes("jp")}
                onChange={handleCategoryChange}
              />
              일식
            </label>

            <label>
              <input
                type="checkbox"
                value="ch"
                checked={categories.includes("ch")}
                onChange={handleCategoryChange}
              />
              중식
            </label>
          </div>
        </div>

        <div className={styles.sort}>
          <div>정렬</div>
          <div className={styles.order}>
            <label>
              <input
                type="radio"
                name="order"
                value="latest"
                checked={order === "latest"}
                onChange={(e) => setOrder(e.target.value)}
              />
              최신순
            </label>

            <label>
              <input
                type="radio"
                name="order"
                value="view"
                checked={order === "view"}
                onChange={(e) => setOrder(e.target.value)}
              />
              조회순
            </label>
          </div>
        </div>

        <div className={styles.filter_btn}>
          <button type="button">필터적용</button>
        </div>
      </section>
      <section className={styles.list_section}>
        <div className={styles.restName}>
          <input
            type="text"
            name="restName"
            id="restName"
            value={restName}
            onChange={(e) => setRestName(e.target.value)}
          ></input>
          <button>검색</button>
        </div>
        <div className={styles.rest_list}>
          {restList.map((rest) => {
            return (
              <RestaurantItem
                key={`${rest.restNo}`}
                rest={rest}
              ></RestaurantItem>
            );
          })}
        </div>
        <div className={styles.regist_btn}>
          <button type="button">맛집 등록</button>
        </div>

        <div className={styles.pagination}>
          <Pagination
            totalPage={totalPage}
            page={page}
            setPage={setPage}
            naviSize={5}
          />
        </div>
      </section>
    </>
  );
};

export default RestaurantDetailSearch;
