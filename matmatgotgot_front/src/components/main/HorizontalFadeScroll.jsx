import { useEffect, useRef, useState } from "react";
import styles from "./HorizontalFadeScroll.module.css";
import CardTemp from "./CardTemp";

// 💡 1. 상위(Main_login)에서 넘겨준 onCardClick 함수를 Props로 받습니다.
const HorizontalFadeScroll = ({ items, onCardClick }) => {
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const scrollRef = useRef(null);

  const dragStatus = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false, // 💡 드래그와 단순 클릭을 구분하기 위한 플래그 플러그인 추가
  });

  const onMouseDown = (e) => {
    dragStatus.current.isDown = true;
    dragStatus.current.moved = false; // 마우스를 누른 시점에는 아직 움직이지 않음
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

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStatus.current.startX) * 1.5;

    // 💡 미세하게 마우스가 일정 거리 이상 움직였다면 의도적인 "드래그 스크롤"로 판단
    if (Math.abs(x - dragStatus.current.startX) > 5) {
      dragStatus.current.moved = true;
    }

    scrollRef.current.scrollLeft = dragStatus.current.scrollLeft - walk;
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftFade(scrollLeft > 0);
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 4);
  };

  // 💡 2. 마우스를 뗄 때 실행될 클릭 안전 장치 핸들러
  const handleItemClick = (restNo) => {
    // 마우스를 움직이면서 드래그 조작을 한 상태라면 상세페이지로 이동하지 않음
    if (dragStatus.current.moved) return;

    // 순수한 클릭이었고, 상위 함수가 존재한다면 메인 페이지의 이동 로직 호출
    if (onCardClick && restNo) {
      onCardClick(restNo);
    }
  };

  useEffect(() => {
    handleScroll();
  }, [items]);

  return (
    <>
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
        {items.map((item, index) => (
          /* 💡 3. 개별 카드들을 이벤트 타겟팅이 가능한 실제 <div> 태그로 감싸고 
                 클릭 이벤트와 커서 스타일, 유일 키값을 명시해 줍니다. */
          <div
            key={`myList-${index}`}
            onClick={() => handleItemClick(item.restNo)}
            style={{ cursor: "pointer", display: "inline-block" }}
          >
            <CardTemp item={item} />
          </div>
        ))}
      </div>
      <div
        className={`${styles.fadeOverlayRight} ${showRightFade ? "" : styles.hide}`}
      />
    </>
  );
};

export default HorizontalFadeScroll;
