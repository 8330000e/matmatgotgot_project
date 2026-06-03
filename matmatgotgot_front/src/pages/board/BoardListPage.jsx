import { useEffect, useState } from 'react';
import styles from './Board.module.css';
import axios from 'axios';
import BoardList from '../../components/board/BoardList';
import Pagination from '../../components/ui/Pagination';
import { Input } from '../../components/ui/Form.jsx';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Swal from 'sweetalert2';
import { height } from '@mui/system';
import defaultBoardImage from '../../assets/board/image.png';
import defaultUserImage from '../../assets/board/user.png';

// 게시글 목록 페이지
const BoardListPage = () => {
  const navigate = useNavigate();

  // zustand에서 로그인 정보 가져오기
  const { admin } = useAuthStore();

  // admin === 1 이 관리자라고 가정
  const isAdmin = Number(admin) === 1;

  const [boardList, setBoardList] = useState([]); //게시글 목록 저장
  const [page, setPage] = useState(0); //현재 페이지 번호
  const [size, setSize] = useState(8); //한 페이지에 몇 개 보여줄지(8개)
  //const [totalPage, setTotalPage] = useState(null); //전체 페이지 개수

  const [totalPage, setTotalPage] = useState(5); //지울거

  const [order, setOrder] = useState(1); //정렬 방식(1: 최신순, 2: 작성순)

  // 카테고리
  const [category, setCategory] = useState(0); //(0:전체, 1:여행후기, 2:자유게시글)

  // 검색 입력값
  const [type, setType] = useState(1); //검색(1:제목, 2:작성자)
  const [keyword, setKeyword] = useState('');

  // 실제 검색값
  const [searchType, setSearchType] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleWriteClick = () => {
    // admin === 2 : 차단 회원
    if (Number(admin) === 2) {
      Swal.fire({
        title: '게시글 작성 불가',
        text: '차단된 회원은 게시글을 작성할 수 없습니다.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
        width: '600px',
      });
    } else {
      navigate('/board/write');
    }
  };

  // ===== 더미 데이터 =====
  const dummyBoards = [
    {
      boardNo: 1,
      boardCategory: 1,
      boardTitle: '부산 여행 다녀왔어요!',
      boardWriter: '맛집러버',
      boardDate: '2026-05-28',
      boardThumb: defaultBoardImage,
      memberThumb: defaultUserImage,
    },
    {
      boardNo: 2,
      boardCategory: 2,
      boardTitle: '서울 분위기 좋은 카페 추천',
      boardWriter: '카페덕후',
      boardDate: '2026-05-27',
      boardThumb: defaultBoardImage,
      memberThumb: defaultUserImage,
    },
    {
      boardNo: 3,
      boardCategory: 1,
      boardTitle: '제주도 흑돼지 맛집 후기',
      boardWriter: '제주러',
      boardDate: '2026-05-26',
      boardThumb: defaultBoardImage,
      memberThumb: defaultUserImage,
    },
    {
      boardNo: 4,
      boardCategory: 2,
      boardTitle: '요즘 여행 어디가 좋나요?',
      boardWriter: '여행초보',
      boardDate: '2026-05-25',
      boardThumb: defaultBoardImage,
      memberThumb: defaultUserImage,
    },
    {
      boardNo: 5,
      boardCategory: 1,
      boardTitle: '강릉 바다뷰 맛집 추천',
      boardWriter: '오션뷰',
      boardDate: '2026-05-24',
      boardThumb: defaultBoardImage,
      memberThumb: defaultUserImage,
    },
    {
      boardNo: 6,
      boardCategory: 2,
      boardTitle: '혼자 여행하기 좋은 곳',
      boardWriter: '솔로트립',
      boardDate: '2026-05-23',
      boardThumb: defaultBoardImage,
      memberThumb: defaultUserImage,
    },
    {
      boardNo: 7,
      boardCategory: 1,
      boardTitle: '대전 빵 맛집 탐방',
      boardWriter: '빵순이',
      boardDate: '2026-05-22',
      boardThumb: defaultBoardImage,
      memberThumb: defaultUserImage,
    },
    {
      boardNo: 8,
      boardCategory: 2,
      boardTitle: '맛집 추천 부탁드립니다',
      boardWriter: '먹스타',
      boardDate: '2026-05-21',
      boardThumb: defaultBoardImage,
      memberThumb: defaultUserImage,
    },
  ];

  /*
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
*/
  // ===== 프론트만 테스트 =====
  useEffect(() => {
    let filtered = [...dummyBoards];

    // 카테고리 필터
    if (category !== 0) {
      filtered = filtered.filter((board) => board.boardCategory === category);
    }

    // 검색 필터
    if (searchKeyword.trim() !== '') {
      if (searchType === 1) {
        filtered = filtered.filter((board) =>
          board.boardTitle.includes(searchKeyword),
        );
      } else {
        filtered = filtered.filter((board) =>
          board.boardWriter.includes(searchKeyword),
        );
      }
    }

    setBoardList(filtered);
  }, [category, searchKeyword, searchType]);

  return (
    <section className={styles.board_wrap}>
      <h3 className={styles.page_title}></h3>

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
                height: '36px',
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
            onClick={handleWriteClick}
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
