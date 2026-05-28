import styles from "./TripMain.module.css";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CasinoSharpIcon from "@mui/icons-material/CasinoSharp";
import { useState } from "react";
import MyCourse from "../../components/trip/MyCourse";

const TripMain = () => {
  const [mapTitleStatus, setMapTitleStatus] = useState(0);

  const clickMapTitle = (status) => {
    setMapTitleStatus(status);
  };

  return (
    <div className={styles.tripMainWrap}>
      {/* 상단 영역 */}
      <div className={styles.topSection}>
        {/* 왼쪽 영역 */}
        <div className={styles.leftSection}>
          {/* 나의 맛집 코스 */}
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

          {/* 먹킷리스트 */}
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
              <div className={styles.myListItems}></div>
            </div>
          </div>
        </div>

        {/* 오른쪽 지도 영역 */}
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

      {/* 취향저격 맛집 */}
      <div className={styles.tasteRestaurantSection}>
        <div className={styles.title}>
          <div className={styles.titleIcon}>
            <AdsClickIcon />
          </div>

          <div className={styles.titleText}>**님 취향저격 맛집</div>
        </div>

        <div className={styles.tasteRestaurantContent}>
          <div className={styles.tasteRestaurantList}></div>
        </div>
      </div>

      {/* 오늘은 이 식당 어떠세요 */}
      <div className={styles.howAboutHereSection}>
        <div className={styles.title}>
          <div className={styles.titleIcon}>
            <CasinoSharpIcon />
          </div>

          <div className={styles.titleText}>오늘은 이 식당 어떠세요?</div>
        </div>

        <div className={styles.howAboutHereContent}>
          <div className={styles.howAboutHereList}></div>
          <div className={styles.buttonContainer}>
            <button className={styles.moreButton}>다른 식당 추천받기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripMain;
