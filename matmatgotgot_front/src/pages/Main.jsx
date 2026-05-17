import "../App.css";
import LeftSideBar from "../components/commons/LeftSideBar";

const Main = () => {
  return (
    <>
      <LeftSideBar />
      <div className="main">
        <div>
          <section>
            <h2>로그인 후 메인페이지</h2>
          </section>
        </div>
      </div>
    </>
  );
};

export default Main;
