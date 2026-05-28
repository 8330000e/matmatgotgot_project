import styles from "./Slide.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";

const Slide = ({ text, list }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div>
      <div className={styles.swiperTitle}>{text}</div>
      <div className={styles.swiperContainer}>
        <button
          ref={prevRef}
          className={`${styles.customArrow} ${styles.prevArrow}`}
        >
          <ArrowBackIosNewIcon />
        </button>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={4}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          className={styles.mySwiper}
        >
          <SwiperSlide className={styles.mySlide}>Slide 1</SwiperSlide>
          <SwiperSlide className={styles.mySlide}>Slide 2</SwiperSlide>
          <SwiperSlide className={styles.mySlide}>Slide 3</SwiperSlide>
          <SwiperSlide className={styles.mySlide}>Slide 4</SwiperSlide>
          <SwiperSlide className={styles.mySlide}>Slide 5</SwiperSlide>
          <SwiperSlide className={styles.mySlide}>Slide 6</SwiperSlide>
        </Swiper>

        <button
          ref={nextRef}
          className={`${styles.customArrow} ${styles.nextArrow}`}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
};

export default Slide;
