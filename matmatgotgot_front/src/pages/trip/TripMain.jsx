import ListFrame from "../../components/trip/ListFrame";
import styles from "./TripMain.module.css";
import MapSharpIcon from "@mui/icons-material/MapSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import LocalFireDepartmentSharpIcon from "@mui/icons-material/LocalFireDepartmentSharp";
import CourseCollect from "../../components/trip/CourseCollect";

const TripMain = () => {
  const courseList = [
    {
      imgName: "test1.png",
      title: "코스입니다.",
      desc: "몇분짜리입니다. 굿굿",
    },
    {
      imgName: "test1.png",
      title: "코스입니다.",
      desc: "어디갑니다. 굿굿",
    },
    {
      imgName: "test1.png",
      title: "코스입니다.",
      desc: "몇분짜리입니다. 굿굿",
    },
    {
      imgName: "test1.png",
      title: "코스입니다.",
      desc: "어디갑니다. 굿굿",
    },
    {
      imgName: "test1.png",
      title: "코스입니다.",
      desc: "몇분짜리입니다. 굿굿",
    },
    {
      imgName: "test1.png",
      title: "코스입니다.",
      desc: "어디갑니다. 굿굿",
    },
    {
      imgName: "test1.png",
      title: "코스입니다.",
      desc: "몇분짜리입니다. 굿굿",
    },
    {
      imgName: "test1.png",
      title: "코스입니다.",
      desc: "어디갑니다. 굿굿",
    },
  ];

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

  return (
    <div className={styles.tripMainWrap}>
      <ListFrame order={0} iconText={iconTexts[0]} items={courseList} />
      <ListFrame order={1} iconText={iconTexts[1]} items={courseList} />
      <ListFrame order={2} iconText={iconTexts[2]} items={courseList} />
      <CourseCollect />
    </div>
  );
};

export default TripMain;
