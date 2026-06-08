import { useEffect, useRef, useState } from "react";
import styles from "./HorizontalFadeScroll.module.css";
import CardTemp from "./CardTemp";

const HorizontalFadeScroll = ({ items }) => {
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
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
    setShowLeftFade(scrollLeft > 0);
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 4);
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
          <CardTemp item={item} key={`myList-${index}`} />
        ))}
      </div>
      <div
        className={`${styles.fadeOverlayRight} ${showRightFade ? "" : styles.hide}`}
      />
    </>
  );
};

export default HorizontalFadeScroll;
