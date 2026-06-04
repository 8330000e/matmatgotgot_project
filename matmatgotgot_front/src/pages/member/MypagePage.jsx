import styles from "./MypagePage.module.css";
import { useAuthStore } from '../../store/useAuthStore';
import {Link} from "react-router-dom";

const MypagePage = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="mypage">
      <button onClick={logout}>로그아웃</button>

        <div className={styles.mypage_wrap}>
            <div className={styles.sidebar_wrap}>
                <div>
                    <p>마이페이지</p>
                </div>
                <div>
                    <ul className={styles.menubar_wrap}>
                        <li>
                            <Link to="/mypage/myinfo">내 정보</Link>
                        </li>
                        <li>
                            <Link to="/mypage/myinfo">내 리뷰</Link>
                        </li>
                        <li>
                            <Link to="/mypage/myinfo">찜한 맛집 목록</Link>
                        </li>
                        <li>
                            <Link to="/mypage/myinfo">맛집 여행 목록</Link>
                        </li>
                        <li>
                            <Link to="/mypage/myinfo">좋아요 게시글</Link>
                        </li>
                        <li>
                            <Link to="/mypage/myinfo">내 게시글</Link>
                        </li>
                        <li>
                            <Link to="/mypage/myinfo">신고 게시글</Link>
                        </li>
                        <li>
                            <Link to="/mypage/myinfo">1:1 문의 내역</Link>
                        </li>
                    </ul>

                </div>
            </div>
            <div className={styles.content_wrap}>

            </div>
        </div>
    </div>
  );
};

export default MypagePage;
