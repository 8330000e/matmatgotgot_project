import ListFrame from "../../components/trip/ListFrame";
import styles from "./TripMain.module.css";
import MapSharpIcon from "@mui/icons-material/MapSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import LocalFireDepartmentSharpIcon from "@mui/icons-material/LocalFireDepartmentSharp";
import CourseCollect from "../../components/trip/CourseCollect";
import { useEffect, useState } from "react";
import axios from "axios";

const TripMain = () => {
  const [myPlans, setMyPlans] = useState([]);
  const [favoritePlans, setFavoritePlans] = useState([]);
  const [top10Plans, setTop10Plans] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 예시 로그인 회원 번호 (로그인 안 된 상태면 null 처리 가능)
  const memberNo = 1;

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:9999/api/trips/main`,
          {
            params: { memberNo: memberNo },
          },
        );

        const { myPlans, favoritePlans, top10Plans } = response.data;

        console.log(response.data);
        // 이미지 경로 데이터 예외 처리 및 state 저장
        const defaultImg = "default_thumbnail.png"; // 이미지가 없을 때 보여줄 기본 이미지

        const mapDefaultImage = (list) =>
          list.map((item) => ({
            ...item,
            imgName: item.imgName ? item.imgName : defaultImg,
            desc: item.desc ? item.desc : "등록된 설명이 없습니다.",
          }));

        setMyPlans(mapDefaultImage(myPlans));
        setFavoritePlans(mapDefaultImage(favoritePlans));
        setTop10Plans(mapDefaultImage(top10Plans));
      } catch (error) {
        console.error("여행 코스 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [memberNo]);

  const iconTexts = [
    {
      icon: <MapSharpIcon />,
      title: "내가 만든 코스",
    },
    {
      icon: <FavoriteSharpIcon />,
      title: "내가 찜한 코스",
    },
    {
      icon: <LocalFireDepartmentSharpIcon />,
      title: "맛곳러들의 추천 코스 TOP10",
    },
  ];

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>; // 로딩 스피너 대체 가능
  }

  return (
    <div className={styles.tripMainWrap}>
      <ListFrame order={0} iconText={iconTexts[0]} items={myPlans} />
      <ListFrame order={1} iconText={iconTexts[1]} items={favoritePlans} />
      <ListFrame order={2} iconText={iconTexts[2]} items={top10Plans} />
      <CourseCollect items={allPlans} />
    </div>
  );
};

export default TripMain;
