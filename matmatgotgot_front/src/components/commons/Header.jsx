import styles from "./Header.module.css";
import { FiBell, FiMail, FiUser, FiSettings } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function Header({ isLoggedIn = true }) {
  const location = useLocation();
  const { memberId } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoArea}>
          <h1 className={styles.logo}>
            <Link to="/">맛맛곳곳</Link>
          </h1>
        </div>

        {isLoggedIn && (
          <nav className={styles.centerMenu}>
            <button
              className={
                location.pathname.startsWith("/restaurant")
                  ? styles.activeMenu
                  : ""
              }
            >
              <Link to="/restaurant">맛집</Link>
            </button>

            <button
              className={
                location.pathname.startsWith("/trip") ? styles.activeMenu : ""
              }
            >
              <Link to="/trip">여행</Link>
            </button>

            <button
              className={
                location.pathname.startsWith("/board") ? styles.activeMenu : ""
              }
            >
              <Link to="/board">게시판</Link>
            </button>
          </nav>
        )}

        <div className={styles.rightArea}>
          {memberId != null ? (
            <div className={styles.userMenu}>
              <button aria-label="알림" className={styles.iconBtn}>
                <FiBell />
              </button>

              <button aria-label="메시지" className={styles.iconBtn}>
                <FiMail />
              </button>

              <Link to="/mypage">
                <button aria-label="마이페이지" className={styles.iconBtn}>
                  <FiUser />
                </button>
              </Link>

              <button aria-label="설정" className={styles.iconBtn}>
                <FiSettings />
              </button>
            </div>
          ) : (
            <div className={styles.authMenu}>
              <button>
                <Link to="/login">Login</Link>
              </button>

              <button>
                <Link to="/signup">Sign Up</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
