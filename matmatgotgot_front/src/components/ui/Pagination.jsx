import styles from './Pagination.module.css';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import IconButton from '@mui/material/IconButton';

const Pagination = ({ page, setPage, totalPage, naviSize }) => {
  if (totalPage === null || totalPage < 1) {
    return;
  }

  const current = page + 1;
  const halfLangth = Math.floor(naviSize / 2);
  let startPage = Math.max(1, current - halfLangth);
  let endPage = Math.min(totalPage, startPage + naviSize - 1);
  startPage = Math.max(1, endPage - naviSize + 1);

  const pages = new Array();

  for (let i = startPage; i < endPage + 1; i++) {
    pages.push(i);
  }

  const isFirst = current === 1;
  const isLast = current === totalPage;

  return (
    <div className={styles.pagination_wrap}>
      <IconButton
        onClick={() => {
          setPage(0);
        }}
        disabled={isFirst}
        className={styles.page_arrow_btn}
      >
        <KeyboardDoubleArrowLeftIcon className={styles.page_arrow} />
      </IconButton>

      <IconButton
        onClick={() => {
          setPage(page - 1);
        }}
        disabled={isFirst}
        className={styles.page_arrow_btn}
      >
        <NavigateBeforeIcon className={styles.page_arrow} />
      </IconButton>

      {pages.map((p, i) => {
        return (
          <IconButton
            key={'pagination-' + i}
            className={p === current ? styles.active : ''}
            onClick={() => {
              setPage(p - 1);
            }}
          >
            {p}
          </IconButton>
        );
      })}

      <IconButton
        onClick={() => {
          setPage(page + 1);
        }}
        disabled={isLast}
        className={styles.page_arrow_btn}
      >
        <NavigateNextIcon className={styles.page_arrow} />
      </IconButton>
      <IconButton
        onClick={() => {
          setPage(totalPage - 1);
        }}
        disabled={isLast}
        className={styles.page_arrow_btn}
      >
        <KeyboardDoubleArrowRightIcon className={styles.page_arrow} />
      </IconButton>
    </div>
  );
};

export default Pagination;
