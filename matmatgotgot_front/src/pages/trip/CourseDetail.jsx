import { useState } from "react";
import styles from "./CourseDetail.module.css";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import TripRoute from "../../components/trip/CourseRouteMap";
import CourseRouteMap from "../../components/trip/CourseRouteMap";

const CourseDetail = () => {
  const [isOwner, setIsOwner] = useState(true);
  const [isLiked, setIsLiked] = useState(true);
  const [likeCount, setLikeCount] = useState(124);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const courseData = {
    title: "코스 이름을 여기 넣을거에요~",
    tags: ["#집", "#가고싶다", "#진짜로", "#졸려"],
    totalDuration: "3시간 30분",
    transport: "도보",
    estimatedCost: "인당 32,000원",
    routes: [
      {
        id: 1,
        step: "01",
        name: "강된장 쌈밥 명동점",
        selectedMenus: ["강된장 쌈밥", "새우 감자전"],
        transitText: "도보 5분",
      },
      {
        id: 2,
        step: "02",
        name: "홍원돈까스 본점",
        selectedMenus: ["안심까스", "치즈까스"],
        transitText: "도보 10분",
      },
      {
        id: 3,
        step: "03",
        name: "황소고집 처인구점",
        selectedMenus: ["통갈매기살"],
        transitText: "",
      },
    ],
  };

  const handleLikeToggle = () => {
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

  return (
    <div className={styles.detailPageContainer}>
      <div className={styles.detailHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.courseTitle}>{courseData.title}</h1>
          <div className={styles.metaRow}>
            <span className={styles.likeBadge}>
              [❤️ {likeCount.toLocaleString()}명이 찜했는지]
            </span>
            {courseData.tags.map((tag, idx) => (
              <span key={idx} className={styles.tagItem}>
                {tag}
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

      <div className={styles.contentBg}>
        <div className={styles.ticketDashboard}>
          <div className={styles.ticketLeft}>
            <CourseRouteMap routes={courseData.routes} />
          </div>

          <div className={styles.ticketDivider}>
            <div className={styles.notchTop}></div>
            <div className={styles.dashedLine}></div>
            <div className={styles.notchBottom}></div>
          </div>

          <div className={styles.ticketRight}>
            <div className={styles.infoSummaryGroup}>
              <div className={styles.infoSummaryLine}>
                <span className={styles.summaryLabel}>총 소요시간</span>
                <span className={styles.summaryValue}>
                  : {courseData.totalDuration}
                </span>
              </div>
              <div className={styles.infoSummaryLine}>
                <span className={styles.summaryLabel}>이동 수단</span>
                <span className={styles.summaryValue}>
                  : {courseData.transport}
                </span>
              </div>
              <div className={styles.infoSummaryLine}>
                <span className={styles.summaryLabel}>예상 식비</span>
                <span className={styles.summaryValue}>
                  : {courseData.estimatedCost}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.timelineContainer}>
          {courseData.routes.map((route, index) => (
            <div key={route.id} className={styles.routeItemNode}>
              <div className={styles.routeNodeHeader}>
                <div className={styles.nodeTitleBox}>
                  <span className={styles.nodeBadge}>
                    🚩 [{route.step} 맛집]
                  </span>
                  <h3 className={styles.nodeResName}>{route.name}</h3>
                </div>
                <div className={styles.headerConnectLine}></div>
                <div className={styles.selectedMenuNames}>
                  {route.selectedMenus.join(", ")}
                </div>
              </div>

              <div className={styles.menuPhotoGrid}>
                {route.selectedMenus.map((menu, mIdx) => (
                  <div key={mIdx} className={styles.detailPhotoCard}>
                    <div className={styles.photoBoxPlaceholder}>사진</div>
                    <div className={styles.photoMenuName}>{menu}</div>
                  </div>
                ))}
              </div>

              {index < courseData.routes.length - 1 && (
                <div className={styles.verticalTransitInfo}>
                  <div className={styles.verticalDotsLine}></div>
                  <div className={styles.transitDurationText}>
                    {route.transitText || "이동 약 5분"}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
