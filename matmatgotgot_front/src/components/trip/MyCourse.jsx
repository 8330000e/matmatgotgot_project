import { useState, useRef, useEffect } from "react";
import styles from "./MyCourse.module.css";

const MyCourse = () => {
  const scrollRef = useRef(null);

  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const courseData = [
    { id: 1, content: "12345678" },
    { id: 2, content: "23456789" },
    { id: 3, content: "34567890" },
    { id: 4, content: "45678901" },
    { id: 5, content: "56789012" },
    { id: 6, content: "67890123" },
    { id: 7, content: "78901234" },
    { id: 8, content: "89012345" },
  ];

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    const isAtTop = scrollTop === 0;
    setShowTopFade(!isAtTop);

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 2;
    setShowBottomFade(!isAtBottom);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  const shouldShowFade = showTopFade && showBottomFade;

  return (
    <>
      <div
        className={`${styles.fadeOverlayTop} ${shouldShowFade ? "" : styles.hide}`}
      />

      <div
        className={styles.myCourseListWrap}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {courseData.map((course) => (
          <div key={course.id} className={styles.myCourseList}>
            <div className={styles.myCourseListCover}>
              이어서 수정하러 갈까요?
            </div>
            <div className={styles.myCourseListContent}>{course.content}</div>
          </div>
        ))}
      </div>

      <div
        className={`${styles.fadeOverlayBottom} ${shouldShowFade ? "" : styles.hide}`}
      />
    </>
  );
};

export default MyCourse;
