import { Link } from "react-router-dom";
import alarmIcon from "../../../public/alarmIcon.svg";
import messageIcon from "../../../public/messageIcon.svg";
import mypageIcon from "../../../public/mypageIcon.svg";
import settingIcon from "../../../public/settingIcon.svg";

const Header = () => {
  return (
    <div className="header">
      <div>
        <h1>맛맛곳곳</h1>
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
