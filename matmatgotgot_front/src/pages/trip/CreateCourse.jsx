import { useState } from "react";
import styles from "./CreateCourse.module.css";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

const CreateCourse = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [openAccordionId, setOpenAccordionId] = useState(null);

  const [tags, setTags] = useState([
    { id: 1, text: "#감성", active: false },
    { id: 2, text: "#집", active: false },
    { id: 3, text: "#가고 싶다", active: false },
    { id: 4, text: "#집", active: true },
    { id: 5, text: "#감성", active: false },
  ]);

  const searchResultsMock = [
    {
      id: 101,
      name: "하이디라오 명동점",
      address: "서울 중구 명동길 43",
      menus: [
        { id: 1, name: "마라탕", price: 22000 },
        { id: 2, name: "꿔바로우", price: 18000 },
      ],
    },
    {
      id: 102,
      name: "하동관 명동본점",
      address: "서울 중구 명동9길 12",
      menus: [{ id: 3, name: "곰탕", price: 15000 }],
    },
    {
      id: 103,
      name: "한일관 압구정점",
      address: "서울 강남구 압구정로38길 14",
      menus: [{ id: 4, name: "불고기 반상", price: 29000 }],
    },
    {
      id: 104,
      name: "홍원돈까스",
      address: "인천 미추홀구 숙골로87번길",
      menus: [
        { id: 5, name: "집 가고 싶다1", price: 9800 },
        { id: 6, name: "집 가고 싶다2", price: 11800 },
        { id: 8, name: "안심까스", price: 13000 },
      ],
    },
    {
      id: 105,
      name: "황소고집",
      address: "경기 용인시 처인구 모현읍",
      menus: [{ id: 7, name: "통갈매기살", price: 16000 }],
    },
  ];

  const handleRestaurantClick = (res) => {
    const isExist = selectedRestaurants.find((item) => item.id === res.id);
    if (isExist) {
      setSelectedRestaurants(
        selectedRestaurants.filter((item) => item.id !== res.id),
      );
    } else {
      setSelectedRestaurants([
        ...selectedRestaurants,
        { ...res, selectedMenus: [] },
      ]);
    }
  };

  const handleMenuToggle = (restaurantId, menu) => {
    setSelectedRestaurants((prev) =>
      prev.map((res) => {
        if (res.id !== restaurantId) return res;
        const isMenuSelected = res.selectedMenus.some((m) => m.id === menu.id);
        const updatedMenus = isMenuSelected
          ? res.selectedMenus.filter((m) => m.id !== menu.id)
          : [...res.selectedMenus, menu];
        return { ...res, selectedMenus: updatedMenus };
      }),
    );
  };

  const handleTagToggle = (id) => {
    setTags(
      tags.map((tag) =>
        tag.id === id ? { ...tag, active: !tag.active } : tag,
      ),
    );
  };

  // --- HTML5 드래그 앤 드롭 구현 ---
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
  };

  // --- 자동 연동 계산 수식 ---
  const totalCount = selectedRestaurants.length;
  const totalMinutes =
    totalCount > 0 ? totalCount * 60 + (totalCount - 1) * 10 : 0;
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
    if (selectedMenus.length === 1) {
      return `📌 ${selectedMenus[0].name} (${menuSum.toLocaleString()}원)`;
    }
    return `📌 ${selectedMenus[0].name} 외 ${selectedMenus.length - 1}개 (총 ${menuSum.toLocaleString()}원)`;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainHeader}>
        <EditIcon className={styles.editIcon} /> <h2>코스 생성하기</h2>
      </div>

      <div className={styles.gridDashboard}>
        <div className={styles.leftColumn}>
          {/* 왼쪽 상단 검색 패널 */}
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
              {searchResultsMock.map((res) => {
                const isSelected = selectedRestaurants.some(
                  (item) => item.id === res.id,
                );
                return (
                  <div
                    key={res.id}
                    className={`${styles.searchResultItem} ${isSelected ? styles.selectedRes : ""}`}
                    onClick={() => handleRestaurantClick(res)}
                  >
                    <div className={styles.resName}>{res.name}</div>
                    <div className={styles.resAddress}>{res.address}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 왼쪽 하단 리스트 정렬 패널 (Gutter 2중 구조) */}
          <div className={styles.courseListPanel}>
            <div className={styles.panelScrollArea}>
              {selectedRestaurants.length === 0 ? (
                <div className={styles.emptyNotice}>
                  상단에서 식당을 검색해 코스에 추가해 보세요.
                </div>
              ) : (
                selectedRestaurants.map((res, index) => (
                  <div key={res.id} className={styles.courseItemWrap}>
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
                        <span className={styles.cardResName}>{res.name}</span>
                        <CloseIcon
                          className={styles.deleteIcon}
                          onClick={() => handleRestaurantClick(res)}
                        />
                      </div>

                      <div
                        className={styles.menuSelectorBar}
                        onClick={() =>
                          setOpenAccordionId(
                            openAccordionId === res.id ? null : res.id,
                          )
                        }
                      >
                        <span>{getMenuSelectorText(res.selectedMenus)}</span>
                        {openAccordionId === res.id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </div>

                      {openAccordionId === res.id && (
                        <div className={styles.menuGridDropdown}>
                          {res.menus.map((menu) => {
                            const isMenuChecked = res.selectedMenus.some(
                              (m) => m.id === menu.id,
                            );
                            return (
                              <div
                                key={menu.id}
                                className={`${styles.menuPhotoCard} ${isMenuChecked ? styles.activeMenu : ""}`}
                                onClick={() => handleMenuToggle(res.id, menu)}
                              >
                                <div className={styles.menuPhotoBox}>
                                  메뉴 사진
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
                        </div>
                      )}
                    </div>

                    {index < selectedRestaurants.length - 1 && (
                      <div className={styles.transitInfo}>
                        <div className={styles.dotsLine}></div>
                        <div className={styles.transitText}>
                          <span>도보 | 대중교통 | 자차</span>
                          <strong>약 10분 소요</strong>
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
          {/* 오른쪽 상단 메타 설정 대시보드 */}
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

          {/* 오른쪽 하단 지도 구역 */}
          <div className={styles.mapPlaceholderPanel}>
            <h2>지도</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
