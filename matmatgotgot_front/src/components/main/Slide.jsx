import styles from "./Slide.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Slide = ({ text, list = [], type }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();
  const [swiperNav, setSwiperNav] = useState(false);

  // Swiper가 DOM 렌더링 완료 후 커스텀 버튼을 올바르게 인지하도록 강제 갱신 트리거 생성
  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      setSwiperNav(true);
    }
  }, [list]);

  const handleCardClick = (id) => {
    if (type === "review") {
      navigate(`/board/detail/${id}`);
    } else if (type === "tour") {
      navigate(`/trip/detail/${id}`);
    }
  };

  // 데이터가 없을 때 슬라이더 전체를 대체할 깔끔한 컴포넌트 리턴 💡
  if (list.length === 0) {
    return (
      <div>
        <div className={styles.swiperTitle}>{text}</div>
        <div className={styles.swiperContainer}>
          <div className={styles.emptyContainer}>
            <div className={styles.emptyText}>
              등록된 {type === "tour" ? "투어 코스가" : "리뷰 게시글이"}{" "}
              없습니다.
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          slidesPerView={list.length < 4 ? list.length : 4}
          navigation={
            swiperNav
              ? {
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }
              : false
          }
          className={styles.mySwiper}
        >
          {list.map((item) => {
            const id = item.boardNo || item.tplanNo;
            const title = item.boardTitle || item.tplanTitle;

            let thumb = null;

            if (type === "review") {
              if (item.boardThumb) {
                const isReviewFullUrl = item.boardThumb.startsWith("http");
                thumb = isReviewFullUrl
                  ? item.boardThumb
                  : `${import.meta.env.VITE_BACKSERVER}/review/${item.boardThumb}`;
              } else {
                thumb = `${import.meta.env.VITE_BACKSERVER}/menu/basic.jpeg`;
              }
            } else if (type === "tour") {
              if (item.menuImg) {
                const isTourFullUrl = item.menuImg.startsWith("http");
                thumb = isTourFullUrl
                  ? item.menuImg
                  : `${import.meta.env.VITE_BACKSERVER}/menu/${item.menuImg}`;
              } else {
                thumb = `${import.meta.env.VITE_BACKSERVER}/menu/basic.jpeg`;
              }
            }

            const subText =
              type === "tour" ? item.tplanRegion : `❤️ ${item.likeCount || 0}`;

            return (
              <SwiperSlide
                key={id}
                className={styles.mySlide}
                onClick={() => handleCardClick(id)}
                style={
                  thumb
                    ? {
                        backgroundImage: `url(${thumb})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              >
                <div className={styles.cardOverlay}>
                  <div className={styles.cardTitle}>{title}</div>
                  <div className={styles.cardSub}>{subText}</div>
                </div>
              </SwiperSlide>
            );
          })}
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
