import { Link } from "react-router-dom";
import alarmIcon from "../../assets/alarmIcon.svg";
import messageIcon from "../../assets/messageIcon.svg";
import mypageIcon from "../../assets/mypageIcon.svg";
import settingIcon from "../../assets/settingIcon.svg";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./Commons.module.css";

export const Header = () => {
  const memberNickname = useAuthStore((state) => state.memberNickname);
  const isReady = useAuthStore((state) => state.isReady);
  const logout = useAuthStore((state) => state.logout);

  if (!isReady) {
    return null;
  }

  return (
    <div className="header">
      <div>
        <Link to="/">
          <h1>맛맛곳곳</h1>
        </Link>
      </div>
      <div>
        <ul>
          <li>
            <Link to="#">
              <img src={alarmIcon} alt="alarmIcon" />
            </Link>
          </li>
          <li>
            <Link to="#">
              <img src={messageIcon} alt="Messages" />
            </Link>
          </li>
          <li>
            <Link to="/mypage">
              <img src={mypageIcon} alt="mypage" />
            </Link>
          </li>
          <li>
            <Link to="#">
              <img src={settingIcon} alt="Settings" />
            </Link>
          </li>
        </ul>
      </div>
      {memberNickname == null ? (
        <div className={styles.loginSignup}>
          <div>
            <Link to="/login">Login</Link>
          </div>
          <div>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      ) : (
        <div>
          <ul>
            <li>{memberNickname}</li>
            <li>
              <button onClick={logout}>로그아웃</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
