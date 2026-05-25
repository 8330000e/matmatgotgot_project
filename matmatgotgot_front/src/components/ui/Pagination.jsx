import styles from "./Pagination.module.css";

const Pagination = ({ page, setPage, totalPage, naviSize }) => {
  // totalPage가 없거나 1 미만이면 렌더링 생략
  // undefined 대신 null 반환 — React에서 undefined 반환은 권장하지 않음
  if (totalPage === null || totalPage < 1) return null;

  const current = page + 1; // 화면 표시용 번호 (서버 page는 0-based)
  const halfLength = Math.floor(naviSize / 2);

  // current를 중앙에 오도록 시작/끝 페이지 계산
  let startPage = Math.max(1, current - halfLength);
  let endPage = Math.min(totalPage, startPage + naviSize - 1);

  // 표시할 페이지 번호 배열 생성
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const isFirst = current === 1;
  const isLast = current === totalPage;

  return (
    <div className={styles.pagination_wrap}>
      {/* 이전 페이지 ( < ) */}
      <button onClick={() => setPage(page - 1)} disabled={isFirst}>
        {"<"}
      </button>

      {/* 페이지 번호 목록 — 현재 페이지에 .active 클래스 적용 */}
      {pages.map((p) => (
        <button
          key={p}
          className={p === current ? styles.active : ""}
          onClick={() => setPage(p - 1)}
        >
          {p}
        </button>
      ))}

      {/* 다음 페이지 ( > ) */}
      <button onClick={() => setPage(page + 1)} disabled={isLast}>
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
