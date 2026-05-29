import { useState, useEffect, useRef } from "react";
import styles from "./RestaurantRegist.module.css";
import TextEditor from "../../components/ui/TextEditor";
import axios from "axios";

const RestaurantRegist = () => {
  const [restName, setRestName] = useState("");
  const [restAddr, setRestAddr] = useState("");
  const [restHours, setRestHours] = useState("");
  const [restPhone, setRestPhone] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const mapDivRef = useRef(null);
  const [lat, setLat] = useState(37.5696734);
  const [lng, setLng] = useState(126.9843022);

  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return null;
    }

    const center = new naver.maps.LatLng(37.5696734, 126.9843022);

    const map = new naver.maps.Map(mapDivRef.current, {
      center: center,
      zoom: 18,
    });

    const marker = new naver.maps.Marker({
      position: center,
      map: map,
    });

    const infoWindow = new naver.maps.InfoWindow({
      content: "<h3>KH정보교육원</h3>",
    });

    naver.maps.Event.addListener(marker, "click", () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });

    naver.maps.Event.addListener(map, "click", (e) => {
      map.setCenter(e.coord);

      if (infoWindow.getMap()) {
        infoWindow.close();
      }
    });
  }, []);

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags([...tags, value]);
    } else {
      setTags(tags.filter((item) => item !== value));
    }
  };

  // 텍스트 에디터 내용 업데이트
  const inputContent = (data) => {
    setContent(data);
  };

  const regist = () => {
    if (
      restName === "" ||
      restaddr === "" ||
      restHours === "" ||
      restPhone === "" ||
      category === "" ||
      content === "" ||
      lat === "" ||
      lng === ""
    ) {
      return;
    }

    const requestData = {
      restName,
      restAddr,
      restHours,
      restPhone,
      category,
      content,
      lng,
      lat,
    };

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/restaurants`, requestData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.page_wrap}>
      {/* 페이지 제목 */}
      <h2 className={styles.page_title}>맛집 등록</h2>

      {/* ===== 상단: 좌측 입력 폼 + 우측 지도/카테고리/태그 ===== */}
      <section className={styles.info_section}>
        {/* 좌측: 기본 정보 입력 */}
        <section className={styles.info_left}>
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="restName">
              상호명*
            </label>
            <input
              type="text"
              name="restName"
              id="restName"
              value={restName}
              onChange={(e) => setRestName(e.target.value)}
            />
          </div>

          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="restAddr">
              주소*
            </label>
            <input
              type="text"
              name="restAddr"
              id="restAddr"
              value={restAddr}
              onChange={(e) => setRestAddr(e.target.value)}
            />
          </div>

          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="restHours">
              영업시간
            </label>
            <input
              type="text"
              name="restHours"
              id="restHours"
              value={restHours}
              onChange={(e) => setRestHours(e.target.value)}
            />
          </div>

          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="restPhone">
              전화번호
            </label>
            <input
              type="text"
              name="restPhone"
              id="restPhone"
              value={restPhone}
              onChange={(e) => setRestPhone(e.target.value)}
            />
          </div>

          {/* 카테고리 선택 — radio를 숨기고 label을 pill 버튼으로 스타일링 */}
          <div className={styles.category_wrap}>
            <div className={styles.field_label}>카테고리*</div>
            <div className={styles.category}>
              <label>
                <input
                  type="radio"
                  name="category"
                  value="kr"
                  checked={category === "kr"}
                  onChange={(e) => setCategory(e.target.value)}
                />
                한식
              </label>
              <label>
                <input
                  type="radio"
                  name="category"
                  value="western"
                  checked={category === "western"}
                  onChange={(e) => setCategory(e.target.value)}
                />
                양식
              </label>
              <label>
                <input
                  type="radio"
                  name="category"
                  value="jp"
                  checked={category === "jp"}
                  onChange={(e) => setCategory(e.target.value)}
                />
                일식
              </label>
              <label>
                <input
                  type="radio"
                  name="category"
                  value="ch"
                  checked={category === "ch"}
                  onChange={(e) => setCategory(e.target.value)}
                />
                중식
              </label>
            </div>
          </div>
        </section>

        {/* 우측: 지도 + 카테고리 + 태그 */}
        <section className={styles.info_right}>
          {/* 네이버 지도 */}
          <div className={styles.map_div} ref={mapDivRef} />
        </section>
      </section>

      {/* ===== 본문 내용: 텍스트 에디터 ===== */}
      <section className={styles.rest_content}>
        <div className={styles.field_label}>본문 내용*</div>
        <TextEditor data={content} setData={inputContent} />
      </section>

      {/* ===== 등록 버튼 ===== */}
      <div className={styles.regist_btn}>
        <button type="button" onClick={regist}>
          등록
        </button>
      </div>
    </div>
  );
};

export default RestaurantRegist;
