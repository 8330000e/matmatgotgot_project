import styles from "./MypagePage.module.css";
import { useAuthStore } from '../../store/useAuthStore';
import {Link, useLocation} from "react-router-dom";

export const MypagePage = () => {
    const location = useLocation();
    const path = location.pathname.substring(8);
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="mypage">
      <button onClick={logout}>로그아웃</button>

        <div className={styles.mypage_wrap}>
            <div className={styles.sidebar_wrap}>
                <div>
                    <div className={styles.mypagetxt}>
                        마이페이지
                    </div>
                    <ul className={styles.menubar_wrap}>
                        <Link to="/mypage/myinfo">
                            <li className={path === "myinfo" ? styles.sidebar_active : styles.sidebar_default}>
                            내 정보
                            </li>
                        </Link>
                        <Link to="/mypage/myreview">
                            <li className={path === "myreview" ? styles.sidebar_active : styles.sidebar_default}>
                            내 리뷰
                            </li>
                        </Link>
                        <Link to="/mypage/zzim">
                            <li className={path === "zzim" ? styles.sidebar_active : styles.sidebar_default}>
                            찜한 맛집 목록
                            </li>
                        </Link>
                        <Link to="/mypage/matzip">
                            <li className={path === "matzip" ? styles.sidebar_active : styles.sidebar_default}>
                           맛집 여행 목록
                            </li>
                        </Link>
                        <Link to="/mypage/likeposts">
                            <li className={path === "likeposts" ? styles.sidebar_active : styles.sidebar_default}>
                            좋아요 게시글
                            </li>
                        </Link>
                        <Link to="/mypage/myposts">
                            <li className={path === "myposts" ? styles.sidebar_active : styles.sidebar_default}>
                            내 게시글
                            </li>
                        </Link>
                        <Link to="/mypage/reportposts">
                            <li className={path === "reportposts" ? styles.sidebar_active : styles.sidebar_default}>
                            신고 게시글
                            </li>
                        </Link>
                        <Link to="/mypage/myask">
                            <li className={path === "myask" ? styles.sidebar_active : styles.sidebar_default}>
                            1:1 문의 내역
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className={styles.content_wrap}>
                {path === "myinfo" && <Myinfo />}
                {path === "myreview" && <Myreview />}
                {path === "zzim" && <Zzim />}
                {path === "matzip" && <Matzip />}
                {path === "likeposts" && <Likeposts />}
                {path === "myposts" && <Myposts />}
                {path === "reportposts" && <Reportposts />}
                {path === "myask" && <Myask />}
            </div>
        </div>
    </div>
  );
};

export const Myinfo = () => {
    return (<>
        <div className={styles.content_menu_wrap}>
            <div></div>
            <div>
                <div>
                    <div></div>
                    <div></div>
                </div>
                <div>

                </div>
            </div>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
    </>);
};

export const Myreview = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Zzim = () => {
    return (<>
        <div className={styles.content_menu_wrap}>
            <div>우우우</div>
        </div>
    </>);};

export const Matzip = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Likeposts = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Myposts = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Reportposts = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Myask = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};


export default { MypagePage, Myinfo, Myreview, Zzim, Matzip, Likeposts, Myposts, Reportposts, Myask };
