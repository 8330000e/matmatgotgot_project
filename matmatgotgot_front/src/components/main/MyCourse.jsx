import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore.js";
import styles from "./MyCourse.module.css";

const MyCourse = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const { memberNo, isReady } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowTopFade(scrollTop > 0);
    setShowBottomFade(scrollTop + clientHeight < scrollHeight - 5);
  };

  useEffect(() => {
    if (!isReady || !memberNo) return;

    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKSERVER}/trips/my-unfinished`,
          { params: { memberNo } },
        );
        setCourses(response.data);
      } catch (error) {
        console.error("나의 여행 코스 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [memberNo, isReady]);

  useEffect(() => {
    if (courses.length > 0) {
      handleScroll();
    }
  }, [courses]);

  if (!memberNo)
    return <div className={styles.emptyState}>로그인이 필요합니다.</div>;
  if (loading)
    return <div className={styles.loading}>코스를 불러오는 중...</div>;

  return (
    <>
      <div
        className={`${styles.fadeOverlayTop} ${showTopFade ? "" : styles.hide}`}
      />

      <div
        className={styles.myCourseListWrap}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {courses.length === 0 ? (
          <div className={styles.emptyState}>
            <span>작성 중인 여행 코스가 없습니다.</span>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.tplanNo}
              className={styles.myCourseCard}
              onClick={() => navigate(`/trip/edit/${course.tplanNo}`)}
            >
              {/* 호버 시 덮어씌워질 오버레이 */}
              <div className={styles.myCourseListCover}>
                🚀 이어서 수정하러 가기
              </div>

              <div className={styles.cardHeader}>
                <h3 className={styles.courseTitle}>{course.tplanTitle}</h3>
                <span className={styles.dayBadge}>{course.tplanDays}Days</span>
              </div>

              <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                  📍 맛집 <strong>{course.restaurantCount}</strong>곳
                </span>
                <span className={styles.metaItem}>
                  🔥 조회수 {course.tplanView}
                </span>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.totalPrice}>
                  {course.tplanTotalPrice > 0
                    ? `${course.tplanTotalPrice.toLocaleString()}원`
                    : "예산 미정"}
                </span>
                <span>{course.formattedDate}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        className={`${styles.fadeOverlayBottom} ${showBottomFade ? "" : styles.hide}`}
      />
    </>
  );
};

export default MyCourse;
