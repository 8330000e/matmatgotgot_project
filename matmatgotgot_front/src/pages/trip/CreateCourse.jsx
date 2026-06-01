import { useEffect, useState } from "react";
import styles from "./CreateCourse.module.css";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add"; // ─── 더하기 아이콘 추가
import axios from "axios";
import CourseMap from "../../components/trip/CourseMap";

const CreateCourse = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [transitTimes, setTransitTimes] = useState({});
  const [transitModes, setTransitModes] = useState({});

  // ─── 메뉴 직접 추가 전용 State ───
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [targetRestaurantId, setTargetRestaurantId] = useState(null);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuImage, setNewMenuImage] = useState(null);
  const [newMenuImagePreview, setNewMenuImagePreview] = useState("");

  const TMAP_APP_KEY = import.meta.env.VITE_TMAP_APP_KEY;
  const ODSAY_API_KEY = import.meta.env.VITE_ODSAY_API_KEY;

  const [tags, setTags] = useState([
    { id: 1, text: "#감성", active: false },
    { id: 2, text: "#집", active: false },
    { id: 3, text: "#가고 싶다", active: false },
    { id: 4, text: "#집", active: true },
    { id: 5, text: "#감성", active: false },
  ]);

  const handleRestaurantClick = (res) => {
    const isExist = selectedRestaurants.find(
      (item) => item.restNo === res.restNo,
    );
    if (isExist) {
      setSelectedRestaurants(
        selectedRestaurants.filter((item) => item.restNo !== res.restNo),
      );
    } else {
      setSelectedRestaurants([
        ...selectedRestaurants,
        { ...res, selectedMenus: [], menus: res.menus || [] },
      ]);
    }
  };

  const handleMenuToggle = (restaurantId, menu) => {
    setSelectedRestaurants((prev) =>
      prev.map((res) => {
        if (res.restNo !== restaurantId) return res;
        const isMenuSelected = res.selectedMenus.some((m) => m.id === menu.id);
        const updatedMenus = isMenuSelected
          ? res.selectedMenus.filter((m) => m.id !== menu.id)
          : [...res.selectedMenus, menu];
        return { ...res, selectedMenus: updatedMenus };
      }),
    );
  };

  // ─── 메뉴 추가 모달 열기 핸들러 ───
  const openAddMenuModal = (e, restaurantId) => {
    e.stopPropagation(); // 아코디언이 닫히는 현상 방지
    setTargetRestaurantId(restaurantId);
    setIsMenuModalOpen(true);
  };

  // ─── 이미지 파일 선택 핸들러 ───
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMenuImage(file);
      setNewMenuImagePreview(URL.createObjectURL(file));
    }
  };

  // ─── 새 메뉴 등록 처리 ───
  const handleAddMenuSubmit = (e) => {
    e.preventDefault();
    if (!newMenuName.trim() || !newMenuPrice.trim()) {
      alert("메뉴명과 가격은 필수 입력 항목입니다.");
      return;
    }

    const priceNum = parseInt(newMenuPrice.replace(/[^0-8]/g, ""), 10);
    if (isNaN(priceNum)) {
      alert("올바른 가격 숫자를 입력해 주세요.");
      return;
    }

    // 새 메뉴 객체 구조화 (고유 ID 생성)
    const newMenuObj = {
      id: `custom_${Date.now()}`,
      name: newMenuName,
      price: priceNum,
      imagePreview: newMenuImagePreview, // 임시 프리뷰 주소 바인딩
    };

    // 대상을 찾아 특정 식당 객체의 menus 배열에 신규 노드 추가
    setSelectedRestaurants((prev) =>
      prev.map((res) => {
        if (res.restNo !== targetRestaurantId) return res;
        return {
          ...res,
          menus: [...(res.menus || []), newMenuObj],
        };
      }),
    );

    // 모달 및 폼 리셋
    setNewMenuName("");
    setNewMenuPrice("");
    setNewMenuImage(null);
    setNewMenuImagePreview("");
    setIsMenuModalOpen(false);
  };

  const handleTagToggle = (id) => {
    setTags(
      tags.map((tag) =>
        tag.id === id ? { ...tag, active: !tag.active } : tag,
      ),
    );
  };

  const [draggedIndex, setDraggedIndex] = useState(null);
  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    if (draggedIndex === null) return;
    const updatedList = [...selectedRestaurants];
    const draggedItem = updatedList[draggedIndex];
    updatedList.splice(draggedIndex, 1);
    updatedList.splice(index, 0, draggedItem);
    setSelectedRestaurants(updatedList);
    setDraggedIndex(null);
    setTransitModes({});
    setTransitTimes({});
  };

  const handleTransitChange = async (index, mode) => {
    setTransitModes((prev) => ({ ...prev, [index]: mode }));
    const origin = selectedRestaurants[index];
    const destination = selectedRestaurants[index + 1];

    if (!origin?.lat || !destination?.lat) {
      alert("식당의 위치 정보(좌표)가 데이터베이스에 존재하지 않습니다.");
      return;
    }

    const startX = Number(origin.lng);
    const startY = Number(origin.lat);
    const endX = Number(destination.lng);
    const endY = Number(destination.lat);

    if (mode === "WALK") {
      try {
        const response = await fetch(
          "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              appKey: TMAP_APP_KEY,
            },
            body: JSON.stringify({
              startX,
              startY,
              endX,
              endY,
              startName: origin.restName || "출발지",
              endName: destination.restName || "목적지",
            }),
          },
        );
        if (!response.ok)
          throw new Error(`HTTP 에러! 상태코드: ${response.status}`);
        const data = await response.json();
        if (data.features && data.features[0]) {
          const totalMinutes = Math.ceil(
            data.features[0].properties.totalTime / 60,
          );
          setTransitTimes((prev) => ({
            ...prev,
            [index]: `${totalMinutes}분`,
          }));
        }
      } catch (error) {
        console.error("Tmap 도보 시간 조회 실패:", error);
        setTransitTimes((prev) => ({ ...prev, [index]: "조회 실패" }));
      }
    } else if (mode === "CAR") {
      try {
        const response = await fetch(
          "https://apis.openapi.sk.com/tmap/routes?version=1&format=json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              appKey: TMAP_APP_KEY,
            },
            body: JSON.stringify({
              startX,
              startY,
              endX,
              endY,
              reqCoordType: "WGS84GEO",
              resCoordType: "WGS84GEO",
              searchOption: "0",
            }),
          },
        );
        if (!response.ok)
          throw new Error(`HTTP 에러! 상태코드: ${response.status}`);
        const data = await response.json();
        if (data.features && data.features[0]) {
          const totalMinutes = Math.ceil(
            data.features[0].properties.totalTime / 60,
          );
          setTransitTimes((prev) => ({
            ...prev,
            [index]: `${totalMinutes}분`,
          }));
        }
      } catch (error) {
        console.error("Tmap 자차 시간 조회 실패:", error);
        setTransitTimes((prev) => ({ ...prev, [index]: "조회 실패" }));
      }
    } else if (mode === "PUB") {
      try {
        const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${startX}&SY=${startY}&EX=${endX}&EY=${endY}&apiKey=${encodeURIComponent(ODSAY_API_KEY)}`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP 에러! 상태코드: ${response.status}`);
        const data = await response.json();
        if (data.result && data.result.path && data.result.path[0]) {
          const totalMinutes = data.result.path[0].info.totalTime;
          setTransitTimes((prev) => ({
            ...prev,
            [index]: `${totalMinutes}분`,
          }));
        } else {
          setTransitTimes((prev) => ({
            ...prev,
            [index]: "도보 추천 (경로 없음)",
          }));
        }
      } catch (error) {
        console.error("ODsay 대중교통 시간 조회 실패:", error);
        setTransitTimes((prev) => ({ ...prev, [index]: "조회 실패" }));
      }
    }
  };

  const totalCount = selectedRestaurants.length;
  const restaurantStayTime = totalCount * 60;
  const totalTransitMinutes = Object.values(transitTimes).reduce(
    (sum, timeStr) => {
      const num = parseInt(timeStr, 10);
      return isNaN(num) ? sum : sum + num;
    },
    0,
  );

  const totalMinutes =
    totalCount > 0 ? restaurantStayTime + totalTransitMinutes : 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalDistance =
    totalCount > 1 ? ((totalCount - 1) * 1.4).toFixed(1) : 0;

  const totalCost = selectedRestaurants.reduce((sum, res) => {
    return sum + res.selectedMenus.reduce((menuSum, m) => menuSum + m.price, 0);
  }, 0);

  const getMenuSelectorText = (selectedMenus) => {
    if (selectedMenus.length === 0) return "📌 필수 메뉴 선택하기";
    const menuSum = selectedMenus.reduce((sum, m) => sum + m.price, 0);
    if (selectedMenus.length === 1)
      return `📌 ${selectedMenus[0].name} (${menuSum.toLocaleString()}원)`;
    return `📌 ${selectedMenus[0].name} 외 ${selectedMenus.length - 1}개 (총 ${menuSum.toLocaleString()}원)`;
  };

  const formatTransitTime = (timeStr) => {
    if (!timeStr) return "";
    if (isNaN(parseInt(timeStr, 10))) return timeStr;
    const totalMinutes = parseInt(timeStr, 10);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
    }
    return `${mins}분`;
  };

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setRestaurants([]);
      return;
    }
    const delayDebounceTimer = setTimeout(async () => {
      try {
        const response = await axios.get("/trips/create/search", {
          params: { keyword: searchKeyword },
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error("맛집 검색 중 오류 발생:", error);
      }
    }, 300);
    return () => clearTimeout(delayDebounceTimer);
  }, [searchKeyword]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainHeader}>
        <EditIcon className={styles.editIcon} /> <h2>코스 생성하기</h2>
      </div>

      <div className={styles.gridDashboard}>
        <div className={styles.leftColumn}>
          <div className={styles.searchBoxPanel}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="식당 검색 (ex: ㅎ)"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <SearchIcon />
            </div>

            <div className={styles.searchResultList}>
              {(() => {
                if (!searchKeyword.trim())
                  return (
                    <div className={styles.searchStatusNotice}>
                      🔍 원하시는 식당을 검색해 보세요!
                    </div>
                  );
                if (restaurants.length === 0)
                  return (
                    <div className={styles.searchStatusNotice}>
                      😭 검색 결과가 없습니다. 다시 입력해 주세요.
                    </div>
                  );

                return restaurants.map((res) => {
                  const isSelected = selectedRestaurants.some(
                    (item) => item.restNo === res.restNo,
                  );
                  return (
                    <div
                      key={res.restNo}
                      className={`${styles.searchResultItem} ${isSelected ? styles.selectedRes : ""}`}
                      onClick={() => handleRestaurantClick(res)}
                    >
                      <div className={styles.resName}>{res.restName}</div>
                      <div className={styles.resAddress}>{res.restAddr}</div>
                      <div className={styles.resCategory}>{res.category}</div>
                      <div className={styles.resRating}>
                        ⭐ {res.ratingAverage} ({res.reviewTotalCount}건)
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className={styles.courseListPanel}>
            <div className={styles.panelScrollArea}>
              {selectedRestaurants.length === 0 ? (
                <div className={styles.emptyNotice}>
                  상단에서 식당을 검색해 코스에 추가해 보세요.
                </div>
              ) : (
                selectedRestaurants.map((res, index) => (
                  <div key={res.restNo} className={styles.courseItemWrap}>
                    <div
                      className={styles.courseCard}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                    >
                      <div className={styles.cardHeader}>
                        <span className={styles.orderBadge}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.cardResName}>
                          {res.restName}
                        </span>
                        <CloseIcon
                          className={styles.deleteIcon}
                          onClick={() => handleRestaurantClick(res)}
                        />
                      </div>

                      <div
                        className={styles.menuSelectorBar}
                        onClick={() =>
                          setOpenAccordionId(
                            openAccordionId === res.restNo ? null : res.restNo,
                          )
                        }
                      >
                        <span>{getMenuSelectorText(res.selectedMenus)}</span>
                        {openAccordionId === res.restNo ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </div>

                      {/* ─── [수정] 메뉴 그리드 및 직접 추가 영역 ─── */}
                      {openAccordionId === res.restNo && (
                        <div className={styles.menuGridDropdown}>
                          {(res.menus || []).map((menu) => {
                            const isMenuChecked = res.selectedMenus.some(
                              (m) => m.id === menu.id,
                            );
                            return (
                              <div
                                key={menu.id}
                                className={`${styles.menuPhotoCard} ${isMenuChecked ? styles.activeMenu : ""}`}
                                onClick={() =>
                                  handleMenuToggle(res.restNo, menu)
                                }
                              >
                                <div className={styles.menuPhotoBox}>
                                  {menu.imagePreview ? (
                                    <img
                                      src={menu.imagePreview}
                                      alt={menu.name}
                                      className={styles.menuThumbImg}
                                    />
                                  ) : (
                                    "메뉴 사진"
                                  )}
                                </div>
                                <div className={styles.menuInfo}>
                                  <div className={styles.mName}>
                                    {menu.name}
                                  </div>
                                  <div className={styles.mPrice}>
                                    {menu.price.toLocaleString()}원
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* 항상 마지막 자리에 노출되는 신규 추가 가이드 카드 */}
                          <div
                            className={styles.addMenuTriggerCard}
                            onClick={(e) => openAddMenuModal(e, res.restNo)}
                          >
                            <AddIcon className={styles.addMenuIcon} />
                            <span>메뉴 등록하기</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {index < selectedRestaurants.length - 1 && (
                      <div className={styles.transitInfo}>
                        <div className={styles.dotsLine}></div>
                        <div className={styles.transitText}>
                          <div className={styles.transitBtnGroup}>
                            <button
                              type="button"
                              className={`${styles.transitBtn} ${(transitModes[index] || "WALK") === "WALK" ? styles.activeTransit : ""}`}
                              onClick={() => handleTransitChange(index, "WALK")}
                            >
                              도보
                            </button>
                            <button
                              type="button"
                              className={`${styles.transitBtn} ${transitModes[index] === "PUB" ? styles.activeTransit : ""}`}
                              onClick={() => handleTransitChange(index, "PUB")}
                            >
                              대중교통
                            </button>
                            <button
                              type="button"
                              className={`${styles.transitBtn} ${transitModes[index] === "CAR" ? styles.activeTransit : ""}`}
                              onClick={() => handleTransitChange(index, "CAR")}
                            >
                              자차
                            </button>
                          </div>
                          <strong className={styles.durationText}>
                            {transitTimes[index]
                              ? `약 ${formatTransitTime(transitTimes[index])} 소요`
                              : "이동 수단을 선택해 주세요"}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.metaConfigPanel}>
            <div className={styles.inputGroup}>
              <label>코스명</label>
              <input
                type="text"
                placeholder="여기에 써보아요~"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>

            <div className={styles.tagGroupWrap}>
              <label>카테고리 설정</label>
              <div className={styles.tagGrid}>
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`${styles.metaTag} ${tag.active ? styles.tagActive : ""}`}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.summaryDashboard}>
              <div className={styles.summaryLine}>
                <span>총 소요 시간</span>
                <strong>
                  {hours > 0 ? `약 ${hours}시간 ${mins}분` : `약 ${mins}분`}
                </strong>
              </div>
              <div className={styles.summaryLine}>
                <span>총 이동 거리</span>
                <strong>약 {totalDistance}km</strong>
              </div>
              <div className={styles.summaryLine}>
                <span>총 비용</span>
                <strong>약 {totalCost.toLocaleString()}원</strong>
              </div>
            </div>

            <div className={styles.submitRow}>
              <button className={styles.registerBtn}>등록하기 →</button>
            </div>
          </div>

          <div className={styles.mapPlaceholderPanel}>
            <CourseMap list={selectedRestaurants} />
          </div>
        </div>
      </div>

      {/* ─── 3. 신규 메뉴 커스텀 추가 등록 모달 창 ─── */}
      {isMenuModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsMenuModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>✨ 새로운 메뉴 추가</h3>
              <CloseIcon
                className={styles.modalCloseBtn}
                onClick={() => setIsMenuModalOpen(false)}
              />
            </div>
            <form onSubmit={handleAddMenuSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>
                  메뉴명 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="메뉴 이름을 입력하세요"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  가격(원) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  placeholder="숫자만 입력하세요"
                  value={newMenuPrice}
                  onChange={(e) => setNewMenuPrice(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  메뉴 사진 <span className={styles.optional}>(선택)</span>
                </label>
                <div className={styles.imageUploadWrapper}>
                  <input
                    type="file"
                    accept="image/*"
                    id="menuImgInput"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="menuImgInput"
                    className={styles.fileSelectBtn}
                  >
                    파일 선택
                  </label>
                  {newMenuImagePreview && (
                    <div className={styles.previewContainer}>
                      <img
                        src={newMenuImagePreview}
                        alt="미리보기"
                        className={styles.imgPreview}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.modalActionRow}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsMenuModalOpen(false)}
                >
                  취소
                </button>
                <button type="submit" className={styles.saveBtn}>
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;
