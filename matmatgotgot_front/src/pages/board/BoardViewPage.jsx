import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardViewPage.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import userImage from '../../assets/board/user.png';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import Swal from 'sweetalert2';
import { TextArea } from '../../components/ui/Form';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReportIcon from '@mui/icons-material/Report';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';

const BoardViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;

  const [board, setBoard] = useState(null);

  /*
  로그인 구현 완료 시 사용할 코드
  
  const {
    memberId,
    memberNo,
    admin = 0,
    memberStatus = 0,
    isReady,
  } = useAuthStore();
  */

  // 로그인 구현 전 테스트용 코드(일반 유저)
  const memberId = 'user01';
  const memberNo = 1;
  const admin = 0;
  const memberStatus = 0;
  const isReady = true;
  //

  /* 관리자인 경우
  const memberId = 'admin01';
  const memberNo = 9;
  const admin = 1;
  const memberStatus = 0;
  const isReady = true;
  */

  const isAdmin = Number(admin) === 1;
  const isBlocked = Number(memberStatus) >= 1;

  useEffect(() => {
    if (!isReady) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isReady, boardNo]);

  const loginMsg = () => {
    Swal.fire({
      title: '로그인 후 이용 가능합니다.',
      icon: 'info',
      confirmButtonColor: 'var(--color1)',
    });
  };

  const deleteBoard = () => {
    Swal.fire({
      title: '게시글을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--danger)',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`)
          .then((res) => {
            if (res.data === 1) {
              navigate('/board/list');
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const changeBoardStatus = () => {
    const newStatus = board.boardStatus === 1 ? 0 : 1;

    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/status`, {
        boardStatus: newStatus,
      })
      .then((res) => {
        if (res.data === 1) {
          setBoard({ ...board, boardStatus: newStatus });

          Swal.fire({
            title: `게시글이 ${newStatus === 1 ? '공개' : '비공개'} 처리되었습니다.`,
            icon: 'success',
            confirmButtonColor: 'var(--color1)',
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <section className={styles.board_wrap}>
      {board && (
        <>
          <div className={styles.board_view_wrap}>
            <div className={styles.board_view_header}>
              <h2 className={styles.board_title}>
                <span className={styles.category_prefix}>
                  [{board.boardCategory === 1 ? '여행후기' : '자유게시글'}]
                </span>
                {board.boardTitle}

                {isAdmin && board.boardStatus === 0 && (
                  <span className={styles.hidden_status}>(비공개 상태)</span>
                )}
              </h2>

              <div className={styles.board_sub_info}>
                <div className={styles.board_writer}>
                  <div
                    className={
                      board.memberThumb
                        ? styles.member_thumb_exists
                        : styles.member_thumb
                    }
                  >
                    <img
                      src={
                        board.memberThumb
                          ? `${import.meta.env.VITE_IMG_SERVER}/member/thumb/${board.memberThumb}`
                          : userImage
                      }
                      alt="writer"
                    />
                  </div>
                  <span>{board.boardWriter}</span>
                </div>

                <div className={styles.board_date}>{board.boardDate}</div>
              </div>
            </div>

            {(board.placeName || board.locationName) && (
              <div className={styles.location_info_box}>
                <LocationOnIcon className={styles.location_icon} />

                <div className={styles.place_text_box}>
                  <span className={styles.selected_place_name}>
                    {board.placeName || board.locationName}
                  </span>

                  {board.addressName && (
                    <span className={styles.address_name}>
                      {board.addressName}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div
              className={styles.board_view_content}
              dangerouslySetInnerHTML={{ __html: board.boardContent }}
            />
          </div>

          <div className={styles.board_action_wrap}>
            <div className={styles.left_action}>
              <Like boardNo={boardNo} memberId={memberId} loginMsg={loginMsg} />
              <Report boardNo={boardNo} memberId={memberId} loginMsg={loginMsg} />
            </div>

            <div className={styles.right_actions}>
              {!isBlocked && (
                <>
                  {isAdmin && (
                    <Button
                      className="btn info"
                      onClick={changeBoardStatus}
                      style={{ width: '70px', fontSize: '14px' }}
                    >
                      {board.boardStatus === 1 ? '비공개' : '공개'}
                    </Button>
                  )}

                  {memberId && memberId === board.boardWriter && !isAdmin && (
                    <Button
                      className="btn primary"
                      onClick={() => navigate(`/board/modify/${board.boardNo}`)}
                      style={{ width: '70px', fontSize: '14px' }}
                    >
                      수정
                    </Button>
                  )}

                  {(isAdmin || (memberId && memberId === board.boardWriter)) && (
                    <Button
                      className="btn primary outline"
                      onClick={deleteBoard}
                      style={{ width: '70px', fontSize: '14px' }}
                    >
                      삭제
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <BoardCommentComponent
            boardNo={boardNo}
            memberId={memberId}
            memberNo={memberNo}
            isAdmin={isAdmin}
            isBlocked={isBlocked}
            loginMsg={loginMsg}
          />
        </>
      )}
    </section>
  );
};

const Like = ({ boardNo, memberId, loginMsg }) => {
  const [likeInfo, setLikeInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/likes`)
      .then((res) => setLikeInfo(res.data))
      .catch((err) => console.log(err));
  }, [boardNo]);

  const likeOn = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/likes`)
      .then((res) => {
        if (res.data === 1) {
          setLikeInfo({
            ...likeInfo,
            isLike: 1,
            likeCount: likeInfo.likeCount + 1,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const likeOff = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/likes`)
      .then((res) => {
        if (res.data === 1) {
          setLikeInfo({
            ...likeInfo,
            isLike: 0,
            likeCount: likeInfo.likeCount - 1,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {likeInfo && (
        <div className={styles.board_like_wrap}>
          {likeInfo.isLike === 1 ? (
            <ThumbUpAltIcon onClick={memberId ? likeOff : loginMsg} />
          ) : (
            <ThumbUpOffAltIcon onClick={memberId ? likeOn : loginMsg} />
          )}
          <span>{likeInfo.likeCount}</span>
        </div>
      )}
    </>
  );
};

const Report = ({ boardNo, memberId, loginMsg }) => {
  const [reportInfo, setReportInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/reports`)
      .then((res) => setReportInfo(res.data))
      .catch((err) => console.log(err));
  }, [boardNo]);

  const reportOn = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/reports`)
      .then((res) => {
        if (res.data === 1) {
          setReportInfo({
            ...reportInfo,
            isReport: 1,
            reportCount: reportInfo.reportCount + 1,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const reportOff = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/reports`)
      .then((res) => {
        if (res.data === 1) {
          setReportInfo({
            ...reportInfo,
            isReport: 0,
            reportCount: reportInfo.reportCount - 1,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {reportInfo && (
        <div className={styles.board_report_wrap}>
          {reportInfo.isReport === 1 ? (
            <ReportIcon className={styles.active_report} onClick={memberId ? reportOff : loginMsg} />
          ) : (
            <OutlinedFlagIcon onClick={memberId ? reportOn : loginMsg} />
          )}
          <span>{reportInfo.reportCount}</span>
        </div>
      )}
    </>
  );
};

const BoardCommentComponent = ({
  boardNo,
  memberId,
  memberNo,
  isAdmin,
  isBlocked,
  loginMsg,
}) => {
  const [boardComment, setBoardComment] = useState({
    boardCommentContent: '',
    memberNo: memberNo,
    boardNo: boardNo,
  });

  const [boardCommentList, setBoardCommentList] = useState([]);

  const getCommentList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/comments`)
      .then((res) => setBoardCommentList(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCommentList();
  }, [boardNo]);

  const changeCommentStatus = (boardCommentNo, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/boards/comments/${boardCommentNo}/status`,
        { commentStatus: newStatus },
      )
      .then((res) => {
        if (res.data === 1) {
          getCommentList();
        }
      })
      .catch((err) => console.error(err));
  };

  const updateComment = (modifyComment, index) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKSERVER}/boards/comments/${modifyComment.boardCommentNo}`,
        modifyComment,
      )
      .then((res) => {
        if (res.data === 1) {
          const newCommentList = [...boardCommentList];
          newCommentList[index].boardCommentContent =
            modifyComment.boardCommentContent;
          setBoardCommentList(newCommentList);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteComment = (boardCommentNo) => {
    axios
      .delete(`${import.meta.env.VITE_BACKSERVER}/boards/comments/${boardCommentNo}`)
      .then((res) => {
        if (res.data === 1) {
          setBoardCommentList(
            boardCommentList.filter(
              (comment) => comment.boardCommentNo !== boardCommentNo,
            ),
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const registComment = () => {
    if (!memberId) {
      loginMsg();
      return;
    }

    if (isBlocked) {
      Swal.fire({
        title: '차단된 회원은 댓글을 작성할 수 없습니다.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
      });
      return;
    }

    if (boardComment.boardCommentContent.trim() === '') {
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards/comments`, boardComment)
      .then((res) => {
        setBoardCommentList([...boardCommentList, res.data]);
        setBoardComment({ ...boardComment, boardCommentContent: '' });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.comment_wrap}>
      <div className={styles.comment_regist_wrap}>
        <h3>댓글 {boardCommentList.length}</h3>

        <div className={styles.input_item}>
          <TextArea
            value={boardComment.boardCommentContent}
            placeholder="댓글을 입력하세요."
            onChange={(e) => {
              setBoardComment({
                ...boardComment,
                boardCommentContent: e.target.value,
              });
            }}
            disabled={!memberId}
          />

          <Button className="btn primary" onClick={registComment}>
            등록
          </Button>
        </div>
      </div>

      <div className={styles.comment_list_wrap}>
        {boardCommentList.map((comment, index) => (
          <BoardComment
            key={`comment-${comment.boardCommentNo}`}
            comment={comment}
            index={index}
            memberId={memberId}
            memberNo={memberNo}
            isAdmin={isAdmin}
            isBlocked={isBlocked}
            loginMsg={loginMsg}
            updateComment={updateComment}
            deleteComment={deleteComment}
            changeCommentStatus={changeCommentStatus}
          />
        ))}
      </div>
    </div>
  );
};

const BoardComment = ({
  comment,
  index,
  memberId,
  memberNo,
  isAdmin,
  isBlocked,
  loginMsg,
  updateComment,
  deleteComment,
  changeCommentStatus,
}) => {
  const [isModifyMode, setIsModifyMode] = useState(false);

  const [modifyComment, setModifyComment] = useState({
    boardCommentContent: comment.boardCommentContent,
    boardCommentNo: comment.boardCommentNo,
  });

  const reportComment = () => {
    if (!memberId) {
      loginMsg();
      return;
    }

    Swal.fire({
      title: '댓글 신고 기능은 댓글 신고 API 연결 후 사용 가능합니다.',
      icon: 'info',
      confirmButtonColor: 'var(--color1)',
    });
  };

  const isWriter =
    memberId === comment.boardCommentWriter ||
    Number(memberNo) === Number(comment.memberNo);

  return (
    <ul className={styles.comment_item}>
      <li className={styles.comment_info}>
        <div className={styles.comment_left_info}>
          <div className={styles.comment_writer_wrap}>
            <div className={comment.memberThumb ? styles.member_thumb_exists : ''}>
              <img
                src={
                  comment.memberThumb
                    ? `${import.meta.env.VITE_IMG_SERVER}/member/thumb/${comment.memberThumb}`
                    : userImage
                }
                alt="comment-writer"
              />
            </div>
            <span>{comment.boardCommentWriter}</span>
          </div>

          <span className={styles.comment_date}>{comment.boardCommentDate}</span>

          <OutlinedFlagIcon
            className={styles.comment_report_icon}
            onClick={reportComment}
          />
        </div>

        {memberId && !isBlocked && (
          <div className={styles.comment_btn_box}>
            {isModifyMode ? (
              <>
                <Button
                  className="btn primary sm"
                  onClick={() => {
                    updateComment(modifyComment, index);
                    setIsModifyMode(false);
                  }}
                  style={{ width: '70px', fontSize: '14px' }}
                >
                  수정완료
                </Button>

                <Button
                  className="btn primary outline"
                  onClick={() => {
                    setModifyComment({
                      ...modifyComment,
                      boardCommentContent: comment.boardCommentContent,
                    });
                    setIsModifyMode(false);
                  }}
                  style={{ width: '70px', fontSize: '14px' }}
                >
                  수정취소
                </Button>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Button
                    className={
                      comment.commentStatus === 1
                        ? 'btn info sm'
                        : 'btn secondary sm'
                    }
                    onClick={() =>
                      changeCommentStatus(
                        comment.boardCommentNo,
                        comment.commentStatus,
                      )
                    }
                    style={{ width: '70px', fontSize: '14px' }}
                  >
                    {comment.commentStatus === 1 ? '비공개' : '공개'}
                  </Button>
                )}

                {isWriter && !isAdmin && (
                  <Button
                    className="btn primary"
                    onClick={() => setIsModifyMode(true)}
                    style={{ width: '70px', fontSize: '14px' }}
                  >
                    수정
                  </Button>
                )}

                {(isWriter || isAdmin) && (
                  <Button
                    className="btn primary outline sm"
                    onClick={() => {
                      Swal.fire({
                        title: '댓글을 삭제하시겠습니까?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: '삭제',
                        cancelButtonText: '취소',
                        confirmButtonColor: 'var(--primary)',
                        cancelButtonColor: 'var(--danger)',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteComment(comment.boardCommentNo);
                        }
                      });
                    }}
                    style={{ width: '70px', fontSize: '14px' }}
                  >
                    삭제
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </li>

      <li className={styles.comment_content}>
        {comment.commentStatus === 1 || isAdmin || isWriter ? (
          <div
            className={
              comment.commentStatus === 0 ? styles.comment_hidden_admin : ''
            }
          >
            {comment.commentStatus === 0 && (
              <p className={styles.admin_notice}>
                {isAdmin
                  ? '* 이 댓글은 현재 일반 사용자에게 비공개 상태입니다.'
                  : '* 이 댓글은 관리자에 의해 비공개 처리되었습니다.'}
              </p>
            )}

            <TextArea
              value={modifyComment.boardCommentContent}
              onChange={(e) => {
                setModifyComment({
                  ...modifyComment,
                  boardCommentContent: e.target.value,
                });
              }}
              disabled={!isModifyMode}
            />
          </div>
        ) : (
          <div className={styles.comment_blocked_msg}>
            관리자에 의해 비공개 처리된 댓글입니다.
          </div>
        )}
      </li>
    </ul>
  );
};

export default BoardViewPage;