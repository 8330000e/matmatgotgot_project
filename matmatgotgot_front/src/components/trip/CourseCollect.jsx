import { useState, useEffect, useRef } from "react";
import styles from "./CourseCollect.module.css";
import SearchIcon from "@mui/icons-material/Search";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";

const CourseCollect = () => {
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [isInfinite, setIsInfinite] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const observerRef = useRef(null);

  // 60개의 임시 테스트 데이터 생성
  const allCourseItems = Array(60)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: `[${i + 1}번째 코스] 제목이랑 도시? 음 뭐 넣어 야될까요 대충 글씨~`,
      desc: "지역, 총 소요시간, 썸네일, 대표 맛집 태그 어쩌고 저쩌고",
    }));

  const currentItems = allCourseItems.slice(0, visibleCount);

  // 제공해주신 색상 매칭을 위한 테마 맞춤 태그 상태
  const [tagList, setTagList] = useState([
    { id: 1, text: "#감성", active: false },
    { id: 2, text: "#집", active: false },
    { id: 3, text: "#가고 싶다", active: false },
    { id: 4, text: "#집", active: true },
    { id: 5, text: "#가고 싶다", active: false },
    { id: 6, text: "#가고 싶다", active: false },
    { id: 7, text: "#집", active: false },
    { id: 8, text: "#감성", active: false },
  ]);

  const toggleTag = (id) => {
    setTagList((prev) =>
      prev.map((tag) =>
        tag.id === id ? { ...tag, active: !tag.active } : tag,
      ),
    );
  };

  const handleMoreClick = () => {
    setVisibleCount((prev) => prev + 12);
    setIsInfinite(true);
  };

  useEffect(() => {
    if (!isInfinite || visibleCount >= allCourseItems.length) return;

    const handleIntersect = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setTimeout(() => {
          setVisibleCount((prev) => prev + 12);
        }, 300);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });
    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [isInfinite, visibleCount, allCourseItems.length]);

  return (
    <div className={styles.collectPageContainer}>
      <div className={styles.pageHeaderTitle}>
        <OutlinedFlagIcon className={styles.flagIcon} />
        <div>코스 모아보기</div>
      </div>

      <div className={styles.mainBoard}>
        <div className={styles.controllerRow}>
          <div className={styles.searchBarWrap}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="검색어를 입력하세요"
            />
            <SearchIcon className={styles.searchIcon} />
          </div>

          <div className={styles.filterBtnGroup}>
            <button
              className={`${styles.filterBtn} ${showTagPopup ? styles.activeFilter : ""}`}
              onClick={() => setShowTagPopup(!showTagPopup)}
            >
              태그
            </button>
            <button className={styles.filterBtn}>지역</button>

            {showTagPopup && (
              <div className={styles.tagPopup}>
                {tagList.map((tag) => (
                  <span
                    key={tag.id}
                    className={`${styles.tagBadge} ${tag.active ? styles.tagActive : ""}`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.cardGridContainer}>
          {currentItems.map((item, index) => (
            <div key={item.id} className={styles.courseCard}>
              <p
                className={
                  index === 0 ? styles.firstCardText : styles.normalCardText
                }
              >
                {index === 0 ? item.desc : item.title}
              </p>
            </div>
          ))}
        </div>

        {!isInfinite && visibleCount < allCourseItems.length && (
          <div className={styles.moreButtonContainer}>
            <button className={styles.moreButton} onClick={handleMoreClick}>
              더보기
            </button>
          </div>
        )}

        {isInfinite && visibleCount < allCourseItems.length && (
          <div ref={observerRef} className={styles.loadingTrigger}>
            <div className={styles.spinner}></div>
            <p>코스를 더 불러오는 중입니다...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCollect;
