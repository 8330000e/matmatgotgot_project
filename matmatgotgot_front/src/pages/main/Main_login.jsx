import styles from "./Main_login.module.css";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CasinoSharpIcon from "@mui/icons-material/CasinoSharp";
import { useEffect, useRef, useState } from "react";
import MyCourse from "../../components/main/MyCourse";
import HorizontalFadeScroll from "../../components/main/HorizontalFadeScroll";
import CardTemp from "../../components/main/CardTemp";

const Main_login = () => {
  const [mapTitleStatus, setMapTitleStatus] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const clickMapTitle = (status) => {
    setMapTitleStatus(status);
  };

  const restaurantList = [
    {
      imgName: "test1.png",
      title: "식당 1",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요. 룰루랄라~ 부럽나요? 부러워요? 저도요. 부럽네요. 사실 다 개뻥이거든요ㅠㅠ 쉬고 싶어요. 집에 보내주세요.",
    },
    {
      imgName: "test1.png",
      title: "식당 2",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요.",
    },
    {
      imgName: "test1.png",
      title: "식당 3",
      desc: "없다 닫았다",
    },
    {
      imgName: "test1.png",
      title: "식당 4",
      desc: "금요일 유후~",
    },
    {
      imgName: "test1.png",
      title: "식당 5",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요. 룰루랄라~ 부럽나요? 부러워요? 저도요. 부럽네요. 사실 다 개뻥이거든요ㅠㅠ 쉬고 싶어요. 집에 보내주세요.",
    },
    {
      imgName: "test1.png",
      title: "식당 6",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요. 룰루랄라~ 부럽나요? 부러워요? 저도요. 부럽네요. 사실 다 개뻥이거든요ㅠㅠ 쉬고 싶어요. 집에 보내주세요.",
    },
    {
      imgName: "test1.png",
      title: "식당 7",
      desc: "황금 금요일",
    },
    {
      imgName: "test1.png",
      title: "식당 8",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요. 룰루랄라~ 부럽나요? 부러워요? 저도요. 부럽네요. 사실 다 개뻥이거든요ㅠㅠ 쉬고 싶어요. 집에 보내주세요.",
    },
    {
      imgName: "test1.png",
      title: "식당 9",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요. 룰루랄라~ 부럽나요? 부러워요? 저도요. 부럽네요. 사실 다 개뻥이거든요ㅠㅠ 쉬고 싶어요. 집에 보내주세요.",
    },
    {
      imgName: "test1.png",
      title: "식당 10",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요. 룰루랄라~ 부럽나요? 부러워요? 저도요. 부럽네요. 사실 다 개뻥이거든요ㅠㅠ 쉬고 싶어요. 집에 보내주세요.",
    },
    {
      imgName: "test1.png",
      title: "식당 11",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요. 룰루랄라~ 부럽나요? 부러워요? 저도요. 부럽네요. 사실 다 개뻥이거든요ㅠㅠ 쉬고 싶어요. 집에 보내주세요.",
    },
    {
      imgName: "test1.png",
      title: "식당 12",
      desc: "식당설명입니다. 저희는 주 7일 휴일입니다. 언제 오셔도 닫혀있어요. 룰루랄라~ 부럽나요? 부러워요? 저도요. 부럽네요. 사실 다 개뻥이거든요ㅠㅠ 쉬고 싶어요. 집에 보내주세요.",
    },
  ];

  const visibleRestaurants = isExpanded
    ? restaurantList
    : restaurantList.slice(0, 8);

  return (
    <div className={styles.tripMainWrap}>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <div className={styles.myCourseSection}>
            <div className={styles.title}>
              <div className={styles.titleIcon}>
                <AddLocationAltIcon />
              </div>

              <div className={styles.titleText}>
                이어서 완성해보세요, 나의 맛집 코스!
              </div>
            </div>

            <div className={styles.myCourseContent}>
              <MyCourse />
            </div>
          </div>

          <div className={styles.myListSection}>
            <div className={styles.title}>
              <div className={styles.titleIcon}>
                <FormatListBulletedIcon />
              </div>

              <div className={styles.titleText}>
                놓칠 수 없는 나의 먹킷리스트
              </div>
            </div>

            <div className={styles.myListContent}>
              <HorizontalFadeScroll items={restaurantList} />
            </div>
          </div>
        </div>

        <div className={styles.mapSection}>
          <div className={styles.mapTitle}>
            <div
              className={`${styles.mapTitleWish} ${mapTitleStatus === 0 ? "" : styles.nonActiveMapTitle}`}
              onClick={() => {
                clickMapTitle(0);
              }}
            >
              가고 싶은
            </div>
            <div className={styles.mapTitleDivider}>|</div>
            <div
              className={`${styles.mapTitleVisited} ${mapTitleStatus === 1 ? "" : styles.nonActiveMapTitle}`}
              onClick={() => {
                clickMapTitle(1);
              }}
            >
              다녀왔던
            </div>
          </div>

          <div className={styles.mapContainer}>
            <div className={styles.map}></div>
          </div>
        </div>
      </div>

      <div className={styles.tasteRestaurantSection}>
        <div className={styles.title}>
          <div className={styles.titleIcon}>
            <AdsClickIcon />
          </div>

          <div className={styles.titleText}>**님 취향저격 맛집</div>
        </div>

        <div className={styles.tasteRestaurantContent}>
          <HorizontalFadeScroll items={restaurantList} />
        </div>
      </div>

      <div className={styles.howAboutHereSection}>
        <div className={styles.title}>
          <div className={styles.titleIcon}>
            <CasinoSharpIcon />
          </div>

          <div className={styles.titleText}>오늘은 이 식당 어떠세요?</div>
        </div>

        <div
          className={`${styles.howAboutHereContent} ${isExpanded ? "" : styles.isCollapsed}`}
        >
          <div className={styles.howAboutHereList}>
            {visibleRestaurants.map((item, index) => (
              <CardTemp item={item} key={`howAbout-${index}`} />
            ))}
          </div>

          {!isExpanded && <div className={styles.fadeOverlayBottom} />}

          <div className={styles.buttonContainer}>
            <button
              className={styles.moreButton}
              onClick={() => setIsExpanded(true)}
              style={{ display: isExpanded ? "none" : "block" }}
            >
              다른 식당 추천받기 (모두 보기)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main_login;
