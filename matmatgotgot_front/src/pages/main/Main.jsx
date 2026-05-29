import styles from "./Main.module.css";
import LeftSideBar from "../../components/commons/Header";
import mainFoodImg from "../../assets/main/main-food.png";
import mainTripImg from "../../assets/main/main-img-1.png";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import Slide from "../../components/main/Slide";

const Main = () => {
  return (
    <div className={styles.main}>
      <div className={styles.mainTripImg}>
        <img src={mainTripImg} alt="메인 여행 이미지" />
      </div>
      <div className={styles.tripTextDev}>
        <div className={styles.tripText1}>맛맛곳곳,</div>
        <div className={styles.tripText2}>내 동선에 맛집을 더하다</div>
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

      <div className={styles.mainReviewDev}>
        <Slide text="베스트 리뷰" />
        <Slide text="베스트 투어" />
      </div>
    </div>
  );
};

export default Main;
