import { useEffect, useState } from "react";
import styles from "./ReviewCommentItem.module.css";
import axios from "axios";
import Swal from "sweetalert2";

const ReviewCommentItem = ({
  commentList,
  setCommentList,
  deleteComment,
  updateComment,
}) => {
  const [curComment, setCurComment] = useState("");
  const [dis, setDis] = useState(true);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 초기화
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // 내용만큼 늘리기
    }
  }, [curComment]); // comment 바뀔 때마다 실행

  const updObj = {
    newComment: curComment,
  };
  const updateComment = () => {
    // 화면에서는 완료 버튼이 눌리면 (dis = false) 댓글 수정 요청을 보낸다
    if (!dis) {
      axios.patch(
        `${import.meta.env.VITE_BACKSERVER}/review/comment/${comment.commentNo}`,
        updObj,
      );
    }

    setDis(!dis);
  };

  const deleteComment = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "삭제 시 정보를 복구할 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        // 댓글 삭제
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/mypages/comment/${comment.commentNo}`,
          )
          .then((res) => {
            if (res.data === 1) {
              // 게시글에서 사라지게
              const newCommentList = commentList.filter((c, i) => {
                return i !== index;
              });

              setCommentList(newCommentList);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div className={styles.comment_wrap}>
      <div className={styles.writer}>
        <div className={styles.comment_wrtier_thumb}>
          <div
            className={
              memberThumb ? styles.member_thumb_exists : styles.member_thumb
            }
          >
            {memberThumb ? (
              <img
                src={`${import.meta.env.VITE_BACKSERVER}/semi/${memberThumb}`}
              />
            ) : (
              <span className="material-icons">account_circle</span>
            )}
          </div>
        </div>
        <div className={styles.comment_name}>{`${comment.writerName}`}</div>
      </div>
      <div
        className={styles.comment_btn_section}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.comment_btn} onClick={updateComment}>
          {dis ? "수정" : "완료"}
        </div>
        <div className={styles.comment_btn} onClick={deleteComment}>
          삭제
        </div>
      </div>
      <div>
        <div className={styles.comment_content}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={curComment}
            onChange={(e) => setCurComment(e.target.value)}
            disabled={dis}
          />
        </div>
        <div className={styles.comment_btn}>
          <button type="button">답글</button>
          <button type="button">신고</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCommentItem;
