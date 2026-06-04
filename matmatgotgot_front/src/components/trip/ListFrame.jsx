import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. useNavigate 임포트
import styles from "./ListFrame.module.css";
import ControlPointSharpIcon from "@mui/icons-material/ControlPointSharp";

const ListFrame = ({ order, iconText, items }) => {
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const navigate = useNavigate(); // 2. navigate 함수 생성

  const scrollRef = useRef(null);

  const dragStatus = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onMouseDown = (e) => {
    dragStatus.current.isDown = true;
    dragStatus.current.startX = e.pageX - scrollRef.current.offsetLeft;
    dragStatus.current.scrollLeft = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    dragStatus.current.isDown = false;
  };

  const onMouseUp = () => {
    dragStatus.current.isDown = false;
  };

  const onMouseMove = (e) => {
    if (!dragStatus.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStatus.current.startX) * 1.5;
    scrollRef.current.scrollLeft = dragStatus.current.scrollLeft - walk;
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    const isAtLeft = scrollLeft <= 0;
    setShowLeftFade(!isAtLeft);

    const isAtRight = scrollLeft + clientWidth >= scrollWidth - 2;
    setShowRightFade(!isAtRight);
  };

  useEffect(() => {
    handleScroll();
  }, [items]);

  // 카드 클릭 시 디테일 페이지 이동 함수
  const handleCardClick = (tplanNo) => {
    if (!tplanNo) return;
    navigate(`/trip/detail/${tplanNo}`);
  };

  // 3. 새 코스 만들기 버튼 클릭 시 이동 함수
  const handleCreateCourseClick = () => {
    navigate("/trip/create");
  };

  return (
    <div className={styles.frameContainer}>
      <div className={styles.titleSection}>
        <div className={styles.titleIcon}>{iconText.icon}</div>
        <div className={styles.titleText}>{iconText.title}</div>
      </div>

      <div className={styles.contentSection}>
        <div
          className={`${styles.fadeOverlayLeft} ${showLeftFade ? "" : styles.hide}`}
        />

        <div
          className={styles.myListItems}
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ cursor: "grab" }}
        >
          {order === 0 && (
            /* 4. 새 코스 만들기 버튼에 onClick 이벤트 및 커서 스타일 추가 */
            <div
              className={styles.createCourseBtn}
              onClick={handleCreateCourseClick}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.plusIcon}>
                <ControlPointSharpIcon />
              </div>
              <div className={styles.btnText}>새 코스 만들기</div>
            </div>
          )}

          {items.map((item, index) => {
            const isFullUrl = item.imgName?.startsWith("http");
            const imgSrc = isFullUrl
              ? item.imgName
              : new URL(
                  `../../assets/restaurant/${item.imgName}`,
                  import.meta.url,
                ).href;

            return (
              <div
                key={`listFrame-${index}`}
                className={styles.cardItem}
                onClick={() => handleCardClick(item.tplanNo)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.thumbnailBox}>
                  <img
                    src={imgSrc}
                    alt="식당 이미지"
                    className={styles.image}
                  />
                </div>
                <div className={styles.descBox}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.description}>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`${styles.fadeOverlayRight} ${showRightFade ? "" : styles.hide}`}
        />
      </div>
    </div>
  );
};

export default ListFrame;
