import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터 파싱용
import axios from "axios";
import styles from "./CourseDetail.module.css";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import CourseRouteMap from "../../components/trip/CourseRouteMap";

const CourseDetail = () => {
  const { tplan_no } = useParams(); // URL에서 번호 추출 (/trip/detail/:tplan_no 구조 상정)

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1); // 💡 다일차 처리를 위한 현재 활성화된 일차 state

  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const loginMemberNo = 1; // 임시 로그인 유저 (세션 혹은 스토어에서 관리 가정)

  // API 호출 연동
  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:9999/api/trips/detail/${tplan_no}`,
        );
        const data = response.data;

        setCourseData(data);
        setLikeCount(data.tplanLike);
        setIsOwner(data.memberNo === loginMemberNo); // 내 글인지 판별
      } catch (error) {
        console.error("상세 코스 정보를 불러오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    if (tplan_no) fetchDetailData();
  }, [tplan_no]);

  const handleLikeToggle = () => {
    // 백엔드와 시너지용 찜 API 호출 토글 로직 대체 가능
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("코스 링크가 클립보드에 복사되었습니다! 🔗");
    setShowSharePopup(false);
  };

  if (loading)
    return (
      <div className={styles.loading}>코스 상세 정보를 로딩 중입니다...</div>
    );
  if (!courseData)
    return <div className={styles.loading}>존재하지 않는 코스입니다.</div>;

  // 💡 현재 탭(일차)에 맞는 루트 노드 배열 추출
  const currentDayRoutes = courseData.dayRoutes[activeDay] || [];

  // 이동 수단 한글 및 텍스트 매핑 포맷터
  const getTransitText = (type) => {
    if (type === "WALK") return "도보 약 5분";
    if (type === "PUB") return "대중교통 약 15분";
    if (type === "CAR") return "차량 이동 약 10분";
    return "이동 약 5분";
  };

  return (
    <div className={styles.detailPageContainer}>
      <div className={styles.detailHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.courseTitle}>{courseData.title}</h1>
          <p className={styles.courseDesc}>{courseData.desc}</p>
          <div className={styles.metaRow}>
            <span className={styles.likeBadge}>
              ❤️ {likeCount.toLocaleString()}명이 찜함 (조회수{" "}
              {courseData.tplanView})
            </span>
            {courseData.tags?.map((tag, idx) => (
              <span key={idx} className={styles.tagItem}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.headerActions}>
          {isOwner && (
            <button className={styles.actionBtn} title="코스 수정">
              <EditIcon />
            </button>
          )}

          <button
            className={styles.actionBtn}
            title="링크 공유"
            onClick={() => setShowSharePopup(!showSharePopup)}
          >
            <ShareIcon />
          </button>

          <button
            className={`${styles.actionBtn} ${isLiked ? styles.likedBtn : ""}`}
            onClick={handleLikeToggle}
            title={isLiked ? "찜 해제" : "코스 찜하기"}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </button>

          {showSharePopup && (
            <div className={styles.sharePopupLayer}>
              <div className={styles.popupHeader}>
                <span>코스 공유하기</span>
                <CloseIcon
                  onClick={() => setShowSharePopup(false)}
                  className={styles.popupClose}
                />
              </div>
              <p className={styles.popupDesc}>
                친구들에게 이 재미있는 코스를 공유해 보세요!
              </p>
              <button className={styles.copyLinkBtn} onClick={handleCopyLink}>
                현재 페이지 링크 복사하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 💡 다일차(Multi-Days) 일차 전환 탭 추가 */}
      {courseData.tplanDays > 1 && (
        <div className={styles.dayTabContainer}>
          {Array.from({ length: courseData.tplanDays }, (_, i) => i + 1).map(
            (day) => (
              <button
                key={day}
                className={`${styles.dayTabBtn} ${activeDay === day ? styles.activeDayTab : ""}`}
                onClick={() => setActiveDay(day)}
              >
                Day {day}
              </button>
            ),
          )}
        </div>
      )}

      <div className={styles.contentBg}>
        <div className={styles.ticketDashboard}>
          <div className={styles.ticketLeft}>
            {/* 현재 선택된 일차의 맵 마커 연동 */}
            <CourseRouteMap routes={currentDayRoutes} />
          </div>

          <div className={styles.ticketDivider}>
            <div className={styles.notchTop}></div>
            <div className={styles.dashedLine}></div>
            <div className={styles.notchBottom}></div>
          </div>

          <div className={styles.ticketRight}>
            <div className={styles.infoSummaryGroup}>
              <div className={styles.infoSummaryLine}>
                <span className={styles.summaryLabel}>전체 일정</span>
                <span className={styles.summaryValue}>
                  : {courseData.tplanDays} Days
                </span>
              </div>
              <div className={styles.infoSummaryLine}>
                <span className={styles.summaryLabel}>여행 지역</span>
                <span className={styles.summaryValue}>
                  : {courseData.region || "미지정"}
                </span>
              </div>
              <div className={styles.infoSummaryLine}>
                <span className={styles.summaryLabel}>총 예상비용</span>
                <span className={styles.summaryValue}>
                  : {courseData.tplanTotalPrice?.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 타임라인 노드 영역 */}
        <div className={styles.timelineContainer}>
          {currentDayRoutes.length === 0 ? (
            <div className={styles.noRoute}>
              이 날은 등록된 일정이 없습니다.
            </div>
          ) : (
            currentDayRoutes.map((route, index) => (
              <div key={route.tscheNo} className={styles.routeItemNode}>
                <div className={styles.routeNodeHeader}>
                  <div className={styles.nodeTitleBox}>
                    <span className={styles.nodeBadge}>
                      🚩 [0{route.tscheOrderNo} 맛집]
                    </span>
                    <h3 className={styles.nodeResName}>{route.restName}</h3>
                  </div>
                  <div className={styles.headerConnectLine}></div>
                  <div className={styles.selectedMenuNames}>
                    {route.selectedMenus?.map((m) => m.menuName).join(", ")}
                  </div>
                </div>

                <div className={styles.menuPhotoGrid}>
                  {route.selectedMenus?.map((menu, mIdx) => (
                    <div key={mIdx} className={styles.detailPhotoCard}>
                      {menu.menuImg ? (
                        <img
                          src={menu.menuImg}
                          alt={menu.menuName}
                          className={styles.photoBoxImg}
                        />
                      ) : (
                        <div className={styles.photoBoxPlaceholder}>
                          사진 없음
                        </div>
                      )}
                      <div className={styles.photoMenuName}>
                        {menu.menuName}
                      </div>
                      <div className={styles.photoMenuPrice}>
                        {menu.menuPrice?.toLocaleString()}원
                      </div>
                    </div>
                  ))}
                </div>

                {index < currentDayRoutes.length - 1 && (
                  <div className={styles.verticalTransitInfo}>
                    <div className={styles.verticalDotsLine}></div>
                    <div className={styles.transitDurationText}>
                      {getTransitText(route.transitType)}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
