import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import { useAuthStore } from '../../store/useAuthStore';
import BoardFrm from '../../components/board/BoardFrm';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const BoardWritePage = ({ categoryTest, setCategoryTest }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // zustand 로그인 정보
  const { memberId, memberStatus, isReady } = useAuthStore();

  // 페이지 진입 시 차단 유저 체크
  useEffect(() => {
    if (isReady) {
      // memberStatus === 1 : 차단 회원
      if (Number(memberStatus) === 1) {
        Swal.fire({
          title: '접근 제한',
          text: '차단된 회원은 게시글 작성 페이지에 접근할 수 없습니다.',
          icon: 'error',
          confirmButtonColor: 'var(--color1)',
        }).then(() => {
          navigate('/board/list');
        });
      }
    }
  }, [isReady, memberStatus, navigate]);

  // 게시글 상태
  const [board, setBoard] = useState({
    boardTitle: '',
    boardContent: '',
    boardCategory: 1, // 1: 여행후기, 2: 자유게시글
    placeNo: null,
    locationName: '',
  });

  // 장소 선택 후 돌아왔을 때
  useEffect(() => {
    if (location.state && location.state.selectedPlace) {
      setBoard((prev) => ({
        ...(location.state.prevBoard || prev),

        boardCategory:
          location.state.boardCategory ||
          location.state.prevBoard?.boardCategory ||
          prev.boardCategory,

        locationName: location.state.selectedPlace,

        placeNo: location.state.placeNo || null,
      }));
    }
  }, [location.state]);

  // input 변경
  const inputBoard = (e) => {
    const { name, value } = e.target;

    setBoard({
      ...board,
      [name]: value,
    });
  };

  // 에디터 내용
  const inputBoardContent = (data) => {
    setBoard({
      ...board,
      boardContent: data,
    });
  };

  // 지도 이동
  const handleMapClick = () => {
    const dataToPass = {
      fromWrite: true,
      prevBoard: board,
    };

    navigate('/boardNavermap', {
      state: dataToPass,
    });
  };

  // 게시글 등록
  const registBoard = () => {
    // 제목 / 내용 검사
    if (board.boardTitle.trim() === '' || board.boardContent.trim() === '') {
      Swal.fire({
        title: '제목과 내용을 입력해주세요.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
      });

      return;
    }

    // 장소 선택 검사
    if (!board.placeNo) {
      Swal.fire({
        title: '장소를 선택해주세요.',
        text: '지도 아이콘을 클릭하여 장소를 지정해야 합니다.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
        width: '600px',
      });

      return;
    }
    // 프론트 테스트용
    console.log(board);

    Swal.fire({
      title: '게시글 작성 완료 (프론트 테스트)',
      icon: 'success',
      confirmButtonColor: 'var(--color1)',
    }).then(() => {
      navigate('/board/list');
    });
    /*
    const form = new FormData();

    // 백엔드 Board entity 기준으로 전송
    form.append('boardTitle', board.boardTitle);
    form.append('boardContent', board.boardContent);
    form.append('boardCategory', Number(board.boardCategory));
    form.append('placeNo', board.placeNo);

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards`, form)
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({
            title: '게시글 작성 완료',
            icon: 'success',
            confirmButtonColor: 'var(--color1)',
          }).then(() => {
            navigate('/board/list');
          });
        }
      })
      .catch((err) => {
        console.error(err);

        Swal.fire({
          title: '게시글 등록 실패',
          text: '잠시 후 다시 시도해주세요.',
          icon: 'error',
          confirmButtonColor: 'var(--color1)',
        });
      });
      */
  };

  return (
    <section className={styles.board_wrap}>
      <h3 className={styles.page_title}></h3>

      <div className={styles.category_wrap}>
        <div className={styles.select_wrap}>
          <select
            className={styles.select}
            name="boardCategory"
            value={board.boardCategory}
            onChange={(e) => {
              const newCategory = Number(e.target.value);

              // 카테고리 변경 시 장소 초기화
              setBoard({
                ...board,
                boardCategory: newCategory,
                placeNo: null,
                locationName: '',
              });
            }}
          >
            <option value={1}>여행후기</option>
            <option value={2}>자유게시글</option>
          </select>

          {/* 지도 버튼 */}
          <span
            className={`${styles.location_icon} material-icons`}
            onClick={handleMapClick}
            style={{
              cursor: 'pointer',
              color: 'var(--color1)',
              fontSize: '30px',
            }}
          >
            location_on
          </span>

          {/* 선택 장소명 */}
          <span className={styles.selected_place_name}>
            {board.locationName ? board.locationName : '장소 선택'}
          </span>
        </div>
      </div>

      <BoardFrm
        board={board}
        inputBoard={inputBoard}
        inputBoardContent={inputBoardContent}
      />

      <div className={styles.btn_wrap}>
        <Button className="btn primary lg" onClick={registBoard}>
          작성하기
        </Button>
      </div>
    </section>
  );
};

export default BoardWritePage;
