import React from "react";
import styles from "./Header.module.css";
import { FiBell, FiMail, FiUser, FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Header({ isLoggedIn = false, currentMenu = "여행" }) {
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
            <button className={currentMenu === "맛집" ? styles.activeMenu : ""}>
              맛집
            </button>
            <button className={currentMenu === "여행" ? styles.activeMenu : ""}>
              여행
            </button>
            <button
              className={currentMenu === "게시판" ? styles.activeMenu : ""}
            >
              게시판
            </button>
          </nav>
        )}

        <div className={styles.rightArea}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <button aria-label="알림" className={styles.iconBtn}>
                <FiBell />
              </button>
              <button aria-label="메시지" className={styles.iconBtn}>
                <FiMail />
              </button>
              <button aria-label="마이페이지" className={styles.iconBtn}>
                <FiUser />
              </button>
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
