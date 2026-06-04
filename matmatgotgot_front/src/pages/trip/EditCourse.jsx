import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CreateCourse.module.css";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import CourseMap from "../../components/trip/CourseMap";

import RestaurantSearch from "../../components/trip/RestaurantSearch";
import SelectedCourseList from "../../components/trip/SelectedCourseList";
import CourseSummaryPanel from "../../components/trip/CourseSummaryPanel";
import AddMenuModal from "../../components/trip/AddMenuModal";
import { useAuthStore } from "../../store/useAuthStore.js"; // 1. useAuthStore 임포트

const EditCourse = () => {
  const { tplan_no } = useParams();
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState({ 1: [] });
  const [currentDay, setCurrentDay] = useState(1);
  const [travelDays, setTravelDays] = useState(1);

  const [courseTitle, setCourseTitle] = useState("");
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [transitTimes, setTransitTimes] = useState({});
  const [transitModes, setTransitModes] = useState({});

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [targetRestaurantId, setTargetRestaurantId] = useState(null);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuImage, setNewMenuImage] = useState(null);
  const [newMenuImagePreview, setNewMenuImagePreview] = useState("");

  const TMAP_APP_KEY = import.meta.env.VITE_TMAP_APP_KEY;
  const ODSAY_API_KEY = import.meta.env.VITE_ODSAY_API_KEY;

  const [tags, setTags] = useState([]);

  // 2. Zustand에서 로그인 회원 정보 및 준비 상태 가져오기
  const { memberNo: loginMemberNo, isReady } = useAuthStore();

  // 3. 비로그인 유저 1차 차단 가드 (Guard)
  useEffect(() => {
    if (isReady && !loginMemberNo) {
      alert("로그인이 필요한 서비스입니다. 메인 페이지로 이동합니다.");
      navigate("/");
    }
  }, [isReady, loginMemberNo, navigate]);

  // 기존 코스 상세 데이터 및 태그 가져오기
  useEffect(() => {
    // Auth 상태가 로드되기 전이거나, 비로그인 상태면 실행 안 함
    if (!isReady || !loginMemberNo) return;

    const fetchOriginalCourseData = async () => {
      try {
        // 1. 태그 전체 목록 먼저 호출
        const tagResponse = await axios.get(
          `${import.meta.env.VITE_BACKSERVER}/trips/create/tags`,
        );
        let tagList = tagResponse.data;

        // 2. 기존 코스 상세 정보 데이터 호출
        const detailResponse = await axios.get(
          `${import.meta.env.VITE_BACKSERVER}/trips/detail/${tplan_no}`,
        );
        const course = detailResponse.data;

        // 4. ⭐ 소유권 체크 (코스 작성자와 로그인한 유저가 다르면 수정 불가)
        if (course.memberNo !== loginMemberNo) {
          alert("본인이 작성한 코스만 수정할 수 있습니다.");
          navigate(`/trip/detail/${tplan_no}`);
          return;
        }

        // 기본 텍스트 및 기본 메타 데이터 매핑
        setCourseTitle(course.title);
        setTravelDays(course.tplanDays);

        // 태그 활성화 유무 기존 정보 비교 매핑
        if (course.tags && course.tags.length > 0) {
          tagList = tagList.map((t) => ({
            ...t,
            active: course.tags.includes(t.tagName || t.name),
          }));
        }
        setTags(tagList);

        // 일차별 데이터 구조 재구조화 매핑
        if (course.dayRoutes) {
          const loadedRestaurants = {};
          const loadedTransitModes = {};

          for (const dayKey of Object.keys(course.dayRoutes)) {
            const routes = course.dayRoutes[dayKey] || [];

            const routesWithMenus = await Promise.all(
              routes.map(async (node, index) => {
                // 이동 정보 복원 로직
                if (index < routes.length - 1) {
                  const nextNode = routes[index + 1];
                  const transitKey = `Day${dayKey}_${node.restNo}_${nextNode.restNo}`;
                  if (node.transitType) {
                    loadedTransitModes[transitKey] = node.transitType;
                  }
                }

                let menuPool = [];
                try {
                  const menuResponse = await axios.get(
                    `${import.meta.env.VITE_BACKSERVER}/trips/create/menus`,
                    { params: { restNo: node.restNo } },
                  );
                  menuPool = menuResponse.data;
                } catch (menuError) {
                  console.error(
                    `식당 번호 ${node.restNo}의 메뉴 조회 실패:`,
                    menuError,
                  );
                  menuPool = node.menus || [];
                }

                return {
                  restNo: node.restNo,
                  restName: node.restName,
                  lat: node.lat,
                  lng: node.lng,
                  selectedMenus: node.selectedMenus || [],
                  menus: menuPool,
                };
              }),
            );

            loadedRestaurants[dayKey] = routesWithMenus;
          }

          setSelectedRestaurants(loadedRestaurants);
          setTransitModes(loadedTransitModes);
        }
      } catch (error) {
        console.error("기존 코스 수정 정보를 불러오지 못했습니다.", error);
        alert("데이터 로딩 실패");
      }
    };

    if (tplan_no) {
      fetchOriginalCourseData();
    }
  }, [tplan_no, isReady, loginMemberNo, navigate]);

  const handleTravelDaysChange = (days) => {
    const numDays = Number(days);
    setTravelDays(numDays);

    setSelectedRestaurants((prev) => {
      const nextState = { ...prev };
      for (let i = 1; i <= numDays; i++) {
        if (!nextState[i]) nextState[i] = [];
      }
      Object.keys(nextState).forEach((key) => {
        if (Number(key) > numDays) delete nextState[key];
      });
      return nextState;
    });

    if (currentDay > numDays) {
      setCurrentDay(numDays);
    }
  };

  const handleRestaurantClick = async (res) => {
    const currentDayList = selectedRestaurants[currentDay] || [];
    const isExist = currentDayList.find((item) => item.restNo === res.restNo);

    if (isExist) {
      setSelectedRestaurants((prev) => ({
        ...prev,
        [currentDay]: currentDayList.filter(
          (item) => item.restNo !== res.restNo,
        ),
      }));
      return;
    }

    if (currentDayList.length >= 6) {
      alert("현재 Day의 식당이 많습니다. 동선상 비효율적일 수 있습니다.");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/trips/create/menus`,
        { params: { restNo: res.restNo } },
      );

      setSelectedRestaurants((prev) => ({
        ...prev,
        [currentDay]: [
          ...currentDayList,
          { ...res, selectedMenus: [], menus: response.data },
        ],
      }));
    } catch (error) {
      console.error("메뉴 조회 실패:", error);
      setSelectedRestaurants((prev) => ({
        ...prev,
        [currentDay]: [
          ...currentDayList,
          { ...res, selectedMenus: [], menus: [] },
        ],
      }));
    }
  };

  const handleMenuToggle = (restaurantId, menu) => {
    setSelectedRestaurants((prev) => ({
      ...prev,
      [currentDay]: prev[currentDay].map((res) => {
        if (res.restNo !== restaurantId) return res;
        const isMenuSelected = res.selectedMenus.some(
          (m) => m.menuNo === menu.menuNo,
        );
        return {
          ...res,
          selectedMenus: isMenuSelected
            ? res.selectedMenus.filter((m) => m.menuNo !== menu.menuNo)
            : [...res.selectedMenus, menu],
        };
      }),
    }));
  };

  const openAddMenuModal = (e, restaurantId) => {
    e.stopPropagation();
    setTargetRestaurantId(restaurantId);
    setIsMenuModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMenuImage(file);
      setNewMenuImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddMenuSubmit = async (e) => {
    e.preventDefault();
    if (!newMenuName.trim() || !newMenuPrice.trim()) {
      alert("메뉴명과 가격은 필수 입력 항목입니다.");
      return;
    }
    const priceNum = parseInt(newMenuPrice.replace(/[^0-9]/g, ""), 10);
    if (isNaN(priceNum)) {
      alert("올바른 가격 숫자를 입력해 주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("restNo", targetRestaurantId);
      formData.append("menuName", newMenuName);
      formData.append("menuPrice", newMenuPrice);
      if (newMenuImage) formData.append("image", newMenuImage);

      await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/trips/create/menu`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const response = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/trips/create/menus`,
        { params: { restNo: targetRestaurantId } },
      );

      setSelectedRestaurants((prev) => ({
        ...prev,
        [currentDay]: prev[currentDay].map((res) =>
          res.restNo === targetRestaurantId
            ? { ...res, menus: response.data }
            : res,
        ),
      }));

      setIsMenuModalOpen(false);
      setNewMenuName("");
      setNewMenuPrice("");
      setNewMenuImage(null);
      setNewMenuImagePreview("");
    } catch (error) {
      console.error(error);
      alert("메뉴 등록 실패");
    }
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
    const currentDayList = [...selectedRestaurants[currentDay]];
    const draggedItem = currentDayList[draggedIndex];
    currentDayList.splice(draggedIndex, 1);
    currentDayList.splice(index, 0, draggedItem);

    setSelectedRestaurants((prev) => ({
      ...prev,
      [currentDay]: currentDayList,
    }));
    setDraggedIndex(null);
    setTransitModes({});
    setTransitTimes({});
  };

  const handleTransitChange = async (transitKey, mode) => {
    setTransitModes((prev) => ({ ...prev, [transitKey]: mode }));
    const [, originNo, destinationNo] = transitKey.split("_");
    const currentDayList = selectedRestaurants[currentDay] || [];

    const origin = currentDayList.find((r) => String(r.restNo) === originNo);
    const destination = currentDayList.find(
      (r) => String(r.restNo) === destinationNo,
    );

    if (!origin?.lat || !destination?.lat) return;

    const startX = Number(origin.lng);
    const startY = Number(origin.lat);
    const endX = Number(destination.lng);
    const endY = Number(destination.lat);

    if (mode === "WALK" || mode === "CAR") {
      const endpoint =
        mode === "WALK"
          ? "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json"
          : "https://apis.openapi.sk.com/tmap/routes?version=1&format=json";

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", appKey: TMAP_APP_KEY },
          body: JSON.stringify(
            mode === "WALK"
              ? {
                  startX,
                  startY,
                  endX,
                  endY,
                  startName: "출발지",
                  endName: "목적지",
                }
              : {
                  startX,
                  startY,
                  endX,
                  endY,
                  reqCoordType: "WGS84GEO",
                  resCoordType: "WGS84GEO",
                  searchOption: "0",
                },
          ),
        });
        const data = await response.json();
        if (data.features?.[0]) {
          const totalMinutes = Math.ceil(
            data.features[0].properties.totalTime / 60,
          );
          setTransitTimes((prev) => ({
            ...prev,
            [transitKey]: `${totalMinutes}분`,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    } else if (mode === "PUB") {
      try {
        const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${startX}&SY=${startY}&EX=${endX}&EY=${endY}&apiKey=${encodeURIComponent(ODSAY_API_KEY)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.result?.path?.[0]) {
          setTransitTimes((prev) => ({
            ...prev,
            [transitKey]: `${data.result.path[0].info.totalTime}분`,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const allRestaurants = Object.values(selectedRestaurants).flat();
  const totalCount = allRestaurants.length;
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
    totalCount > 1
      ? ((totalCount - Object.keys(selectedRestaurants).length) * 1.4).toFixed(
          1,
        )
      : 0;
  const totalCost = allRestaurants.reduce((sum, res) => {
    return (
      sum +
      res.selectedMenus.reduce(
        (menuSum, m) => menuSum + (m.price || m.menuPrice),
        0,
      )
    );
  }, 0);

  const getMenuSelectorText = (selectedMenus) => {
    if (selectedMenus.length === 0) return "📌 필수 메뉴 선택하기";
    const menuSum = selectedMenus.reduce(
      (sum, m) => sum + (m.price || m.menuPrice),
      0,
    );
    if (selectedMenus.length === 1)
      return `📌 ${selectedMenus[0].name || selectedMenus[0].menuName} (${menuSum.toLocaleString()}원)`;
    return `📌 ${selectedMenus[0].name || selectedMenus[0].menuName} 외 ${selectedMenus.length - 1}개 (총 ${menuSum.toLocaleString()}원)`;
  };

  const formatTransitTime = (timeStr) => {
    if (!timeStr || isNaN(parseInt(timeStr, 10))) return timeStr || "";
    const tMinutes = parseInt(timeStr, 10);
    const hr = Math.floor(tMinutes / 60);
    const mn = tMinutes % 60;
    return hr > 0 ? (mn > 0 ? `${hr}시간 ${mn}분` : `${hr}시간`) : `${mn}분`;
  };

  const handleUpdateCourse = async () => {
    if (!courseTitle.trim()) {
      alert("코스명을 입력해 주세요.");
      return;
    }

    const activeTags = tags.filter((t) => t.active).map((t) => t.id || t.tagNo);
    if (Object.values(selectedRestaurants).flat().length === 0) {
      alert("최소 한 개 이상의 식당을 코스에 추가해야 합니다.");
      return;
    }

    const daysData = Object.keys(selectedRestaurants).map((dayStr) => {
      const dayNum = Number(dayStr);
      const restaurantList = selectedRestaurants[dayNum] || [];

      const schedules = restaurantList.map((res, index) => {
        const nextRes = restaurantList[index + 1];
        const transitKey = nextRes
          ? `Day${dayNum}_${res.restNo}_${nextRes.restNo}`
          : null;

        return {
          tscheDayNo: dayNum,
          tscheOrderNo: index + 1,
          restNo: res.restNo,
          selectedMenuNos: res.selectedMenus.map((m) => m.menuNo),
          route: nextRes
            ? { transitType: transitModes[transitKey] || "WALK" }
            : null,
        };
      });

      return { day: dayNum, schedules };
    });

    const payload = {
      tplanNo: tplan_no,
      tplanTitle: courseTitle,
      tplanDesc: "",
      tplanRegion: "",
      tplanDays: travelDays,
      tplanTotalPrice: totalCost,
      tagNos: activeTags,
      days: daysData,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKSERVER}/trips/edit/${tplan_no}`,
        payload,
      );

      if (response.status === 200 || response.status === 201) {
        alert("여행 코스가 성공적으로 수정되었습니다! ✨");
        navigate(`/trip/detail/${tplan_no}`);
      }
    } catch (error) {
      console.error("코스 수정 실패 에러 로그:", error);
      if (error.response) {
        alert(
          `서버 응답 오류 (${error.response.status}): ${error.response.data}`,
        );
      } else {
        alert(`프론트엔드 스크립트 내부 오류: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setRestaurants([]);
      return;
    }
    const delayDebounceTimer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKSERVER}/trips/create/search`,
          { params: { keyword: searchKeyword } },
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(delayDebounceTimer);
  }, [searchKeyword]);

  // Auth 스토어가 완전히 준비되기 전이거나, 로그인이 안 된 상태면 화면 렌더링 차단 (로딩 스피너)
  if (!isReady || !loginMemberNo) {
    return (
      <div className={styles.loading}>페이지 접근 권한을 확인 중입니다...</div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainHeader}>
        <EditIcon className={styles.editIcon} /> <h2>코스 수정하기</h2>
      </div>

      <div className={styles.gridDashboard}>
        <div className={styles.leftColumn}>
          <RestaurantSearch
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            restaurants={restaurants}
            selectedRestaurants={selectedRestaurants[currentDay] || []}
            onRestaurantClick={handleRestaurantClick}
          />

          <SelectedCourseList
            selectedRestaurants={selectedRestaurants[currentDay] || []}
            travelDays={travelDays}
            currentDay={currentDay}
            onDayChange={setCurrentDay}
            openAccordionId={openAccordionId}
            setOpenAccordionId={setOpenAccordionId}
            transitModes={transitModes}
            transitTimes={transitTimes}
            onRestaurantClick={handleRestaurantClick}
            onMenuToggle={handleMenuToggle}
            onOpenAddMenuModal={openAddMenuModal}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onTransitChange={handleTransitChange}
            getMenuSelectorText={getMenuSelectorText}
            formatTransitTime={formatTransitTime}
          />
        </div>

        <div className={styles.rightColumn}>
          <CourseSummaryPanel
            courseTitle={courseTitle}
            setCourseTitle={setCourseTitle}
            travelDays={travelDays}
            onTravelDaysChange={handleTravelDaysChange}
            tags={tags}
            onTagToggle={handleTagToggle}
            hours={hours}
            mins={mins}
            totalDistance={totalDistance}
            totalCost={totalCost}
            onSubmit={handleUpdateCourse}
          />

          <div className={styles.mapPlaceholderPanel}>
            <CourseMap list={selectedRestaurants[currentDay] || []} />
          </div>
        </div>
      </div>

      <AddMenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        newMenuName={newMenuName}
        setNewMenuName={setNewMenuName}
        newMenuPrice={newMenuPrice}
        setNewMenuPrice={setNewMenuPrice}
        newMenuImagePreview={newMenuImagePreview}
        onImageChange={handleImageChange}
        onSubmit={handleAddMenuSubmit}
      />
    </div>
  );
};

export default EditCourse;
