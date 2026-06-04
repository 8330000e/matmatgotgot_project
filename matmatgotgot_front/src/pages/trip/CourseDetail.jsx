import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./CourseDetail.module.css";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import CourseRouteMap from "../../components/trip/CourseRouteMap";
import { fetchOdsayDuration, fetchTmapDuration } from "../../api/routeApi";

const CourseDetail = () => {
  const navigate = useNavigate();

  const { tplan_no } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);

  const [transitDurations, setTransitDurations] = useState({});

  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const loginMemberNo = 1;

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKSERVER}/trips/detail/${tplan_no}`,
        );

        setCourseData(response.data);
        setLikeCount(response.data.tplanLike || 0);
        setIsOwner(response.data.memberNo === loginMemberNo);

        if (response.data.dayRoutes) {
          calculateAllDurations(response.data.dayRoutes);
        }
      } catch (error) {
        console.error("상세 코스 정보를 불러오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    if (tplan_no) fetchDetailData();
  }, [tplan_no]);

  const calculateAllDurations = async (dayRoutes) => {
    const durationsMap = {};

    for (const day of Object.keys(dayRoutes)) {
      const routes = dayRoutes[day] || [];

      for (let i = 0; i < routes.length - 1; i++) {
        const startNode = routes[i];
        const endNode = routes[i + 1];
        const type = startNode.transitType || "WALK";

        const startPos = {
          lat: startNode.lat,
          lng: startNode.lng,
          name: startNode.restName,
        };
        const endPos = {
          lat: endNode.lat,
          lng: endNode.lng,
          name: endNode.restName,
        };
        const mapKey = `${startNode.tscheNo}_${endNode.tscheNo}`;

        let duration = null;

        if (type === "WALK" || type === "CAR") {
          duration = await fetchTmapDuration(startPos, endPos, type);
        } else if (type === "PUB") {
          duration = await fetchOdsayDuration(startPos, endPos);
        }

        if (duration !== null) {
          durationsMap[mapKey] = { duration, type };
        }
      }
    }
    setTransitDurations(durationsMap);
  };

  const handleLikeToggle = async () => {
    try {
      // 1. 찜 테이블(FAVORITE_PLAN_TBL) 관계 토글 처리
      const response = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/trips/favorite/toggle`,
        {
          memberNo: loginMemberNo,
          tplanNo: tplan_no,
        },
      );

      const isNowLiked = response.data; // 서버에서 분기된 결과 (true 또는 false)

      // 2. 찜 토글 결과를 바탕으로 카운트 동기화 API 연동 호출
      const countResponse = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/trips/favorite/count`,
        {
          tplanNo: tplan_no,
          action: isNowLiked ? "INCREMENT" : "DECREMENT",
        },
      );

      // 3. 최종 확정된 DB의 총 카운트 데이터 수치로 프론트 상태 일괄 업데이트
      setIsLiked(isNowLiked);
      setLikeCount(countResponse.data); // 백엔드에서 리턴된 최신 정수 할당
    } catch (error) {
      console.error("찜하기 및 카운트 연동 중 오류가 발생했습니다.", error);
      alert("처리에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const fetchFavoriteStatus = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/trips/favorite/check`,
        {
          params: {
            memberNo: loginMemberNo,
            tplanNo: tplan_no,
          },
        },
      );
      setIsLiked(res.data.isFavorite);
    } catch (err) {
      console.error("찜 상태를 가져오지 못했습니다.");
    }
  };

  useEffect(() => {
    if (tplan_no && loginMemberNo) {
      fetchFavoriteStatus();
    }
  }, [tplan_no]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("코스 링크가 클립보드에 복사되었습니다! 🔗");
    setShowSharePopup(false);
  };

  const formatDuration = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0) return "0분";

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const result = [];
    if (days > 0) result.push(`${days}일`);
    if (hours > 0) result.push(`${hours}시간`);
    if (minutes > 0) result.push(`${minutes}분`);

    return result.join(" ");
  };

  const renderTransitText = (currentNode, nextNode) => {
    const mapKey = `${currentNode.tscheNo}_${nextNode.tscheNo}`;
    const info = transitDurations[mapKey];

    const typeText =
      currentNode.transitType === "WALK"
        ? "🚶 도보"
        : currentNode.transitType === "PUB"
          ? "🚌 대중교통"
          : "🚗 자차";

    if (!info) {
      return `${typeText} 계산 중...`;
    }

    return `${typeText} 약 ${formatDuration(info.duration)}`;
  };

  if (loading)
    return (
      <div className={styles.loading}>코스 상세 정보를 로딩 중입니다...</div>
    );
  if (!courseData)
    return (
      <div className={styles.loading}>
        존재하지 않는 코스이거나 데이터를 불러오지 못했습니다.
      </div>
    );

  const dayRoutesSource = courseData.dayRoutes || {};
  const currentDayRoutes =
    dayRoutesSource[activeDay] || dayRoutesSource[String(activeDay)] || [];

  return (
    <div className={styles.detailPageContainer}>
      <div className={styles.detailHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.courseTitle}>{courseData.title}</h1>
          <p className={styles.courseDesc}>
            {courseData.desc || "등록된 설명이 없습니다."}
          </p>
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
            <button
              className={styles.actionBtn}
              title="코스 수정"
              onClick={() => navigate(`/trip/edit/${tplan_no}`)} // 👈 URL 파라미터로 코스 번호를 넘겨 이동
            >
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

      {/* 다일차 탭 */}
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
                  : {courseData.region || "전체 지역"}
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

        {/* 🛠️ 타임라인 노드 영역 리팩토링 (display: contents 구조화) */}
        <div className={styles.timelineContainer}>
          {currentDayRoutes.length === 0 ? (
            <div className={styles.noRoute}>
              이 날은 등록된 일정이 없습니다.
            </div>
          ) : (
            currentDayRoutes.map((route, index) => (
              <div key={route.tscheNo} style={{ display: "contents" }}>
                <div className={styles.routeItemNode}>
                  <div className={styles.routeNodeHeader}>
                    <div className={styles.nodeTitleBox}>
                      <span className={styles.nodeBadge}>{index + 1}</span>
                      <h3 className={styles.nodeResName}>{route.restName}</h3>
                    </div>
                  </div>

                  <div className={styles.menuPhotoGrid}>
                    {route.selectedMenus && route.selectedMenus.length > 0 ? (
                      // 1. 메뉴가 있을 때는 기존대로 사진 카드들을 렌더링
                      route.selectedMenus.map((menu, mIdx) => {
                        const isFullUrl = menu.imagePreview?.startsWith("http");
                        const imgSrc = isFullUrl
                          ? menu.imagePreview
                          : `${import.meta.env.VITE_BACKSERVER}/menu/${menu.imagePreview}`;

                        return (
                          <div key={mIdx} className={styles.detailPhotoCard}>
                            {menu.imagePreview ? (
                              <img
                                src={imgSrc}
                                alt={menu.name}
                                className={styles.photoBoxImg}
                              />
                            ) : (
                              <div className={styles.photoBoxPlaceholder}>
                                사진 없음
                              </div>
                            )}
                            <div className={styles.photoMenuName}>
                              {menu.name}
                            </div>
                            <div className={styles.photoMenuPrice}>
                              {menu.price?.toLocaleString()}원
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // 2. ⭐ 메뉴가 없을 때 공간을 예쁘게 채워줄 공백 플레이스홀더
                      <div className={styles.emptyMenuPlaceholder}>
                        <span className={styles.emptyIcon}>🍽️</span>
                        <p className={styles.emptyText}>
                          등록된 추천 메뉴가 없습니다.
                        </p>
                        <p className={styles.emptySubText}>
                          나만의 맛있는 조합을 찾아보세요!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 💡 카드가 완전히 닫힌 외부(바깥) 영역에 이동 정보 표현 */}
                {index < currentDayRoutes.length - 1 && (
                  <div className={styles.verticalTransitInfo}>
                    <div className={styles.verticalDotsLine}></div>
                    <div className={styles.transitDurationText}>
                      {renderTransitText(route, currentDayRoutes[index + 1])}
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
