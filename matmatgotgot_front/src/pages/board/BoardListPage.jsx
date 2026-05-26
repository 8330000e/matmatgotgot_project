import { useEffect, useState } from 'react';
import styles from './Board.module.css';
import axios from 'axios';
import BoardList from '../../components/board/BoardList';
import Pagination from '../../components/ui/Pagination';
import { Input } from '../../components/ui/Form';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
//import useAuthStore from '../../components/utils/useAuthStore';
import Swal from 'sweetalert2';
import { height } from '@mui/system';

// 게시글 목록 페이지
const BoardListPage = () => {
  const navigate = useNavigate();
  //const { memberId, Admin } = useAuthStore(); //Admin:회원등급

  const isAdmin = false;

  const [boardList, setBoardList] = useState([]); //게시글 목록 저장
  const [page, setPage] = useState(0); //현재 페이지 번호
  const [size, setSize] = useState(8); //한 페이지에 몇 개 보여줄지(8개)
  const [totalPage, setTotalPage] = useState(null); //전체 페이지 개수
  const [order, setOrder] = useState(1); //정렬 방식(1: 최신순, 2: 작성순)

  // 카테고리
  const [category, setCategory] = useState(0); //(0:전체, 1:여행후기, 2:자유게시글)

  // 검색 입력값
  const [type, setType] = useState(1); //검색(1:제목, 2:작성자)
  const [keyword, setKeyword] = useState('');

  // 실제 검색값
  const [searchType, setSearchType] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  /* 차단 회원
  const handleWriteClick = () => {
    if (member === 2) {
      Swal.fire({
        title: '차단된 회원은 게시글을 작성할 수 없습니다.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
        width: '600px',
      });
    } else {
      navigate('/board/write');
    }
  };
*/

  // 게시글 목록 조회
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards?page=${page}&size=${size}&status=1&order=${order}&searchType=${searchType}&searchKeyword=${searchKeyword}&category=${category}`,
      )
      .then((res) => {
        setBoardList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, searchType, searchKeyword, category]);

  return (
    <section className={styles.board_wrap}>
      <h3 className={styles.page_title}>게시글 목록</h3>

      <div className={styles.list_option_wrap}>
        <div className={styles.left_option}>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => {
              setCategory(Number(e.target.value));
              setPage(0);
            }}
          >
            <option value={0}>전체 카테고리</option>
            <option value={1}>여행후기</option>
            <option value={2}>자유게시글</option>
          </select>

          {/* 검색 */}
          <form
            className={styles.search_wrap}
            onSubmit={(e) => {
              e.preventDefault();
              setSearchType(type);
              setSearchKeyword(keyword);
              setPage(0);
            }}
          >
            <select
              className={styles.select}
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
            >
              <option value={1}>제목</option>
              <option value={2}>작성자</option>
            </select>

            <Input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <Button
              type="submit"
              className="btn primary"
              style={{
                width: '60px',
                height: '30px',
                fontSize: '14px',
                lineHeight: '1',
              }}
            >
              검색
            </Button>
          </form>
        </div>

        <div className={styles.right_option}>
          <select
            className={styles.select}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          >
            <option value={1}>최신순</option>
            <option value={2}>작성순</option>
          </select>
        </div>
      </div>

      <BoardList boardList={boardList} />

      {!isAdmin && (
        <div className={styles.write_btn_zone}>
          <Button
            className="btn primary"
            onClick={() => navigate('/board/write')}
            style={{
              width: '80px',
              fontSize: '14px',
            }}
          >
            글쓰기
          </Button>
        </div>
      )}

      <div className={styles.board_list_pagination}>
        <Pagination
          page={page}
          setPage={setPage}
          totalPage={totalPage}
          naviSize={5}
        />
      </div>
    </section>
  );
};

export default BoardListPage;
