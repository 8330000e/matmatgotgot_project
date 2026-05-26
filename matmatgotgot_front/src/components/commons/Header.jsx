import { Link } from "react-router-dom";
import alarmIcon from "../../assets/alarmIcon.svg";
import messageIcon from "../../assets/messageIcon.svg";
import mypageIcon from "../../assets/mypageIcon.svg";
import settingIcon from "../../assets/settingIcon.svg";

const Header = () => {
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
    </div>
  );
};

export default Header;
