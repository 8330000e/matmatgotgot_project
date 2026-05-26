import styles from "./Main.module.css";
import LeftSideBar from "../components/commons/Header";
import mainFoodImg from "../assets/main/main-food.png";
import mainTripImg from "../assets/main/main-img.png";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";

const Main = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.mainTripImg}>
          <img src={mainTripImg} alt="메인 여행 이미지" />
        </div>

        <div className={styles.mainFoodImg}>
          <img src={mainFoodImg} alt="메인 음식 이미지" />
          <div className={styles.mainFoodImgCover}></div>
          <h1>맛있는 여행의 시작, 맛맛곳곳</h1>
        </div>

        <div className={styles.descContainer}>
          <div className={styles.desc}>
            <div className={styles.descLeft}>
              <div className={styles.descTitle}>
                <div className={styles.titleEmoji}>
                  <RestaurantIcon />
                </div>
                <div className={styles.titleText}>맛집 탐방</div>
              </div>
              <div className={styles.descContent}></div>
            </div>
            <div className={styles.descRight}>
              <div className={styles.descTitle}>
                <div className={styles.titleEmoji}>
                  <ModeOfTravelIcon />
                </div>
                <div className={styles.titleText}>식도락 여행</div>
              </div>
              <div className={styles.descContent}></div>
            </div>
          </div>
        </div>

        <div className={styles.mainTripDev}></div>
      </div>
    </>
  );
};

export default Main;
