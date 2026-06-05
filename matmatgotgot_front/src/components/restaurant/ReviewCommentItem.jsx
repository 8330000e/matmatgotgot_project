import { useEffect, useRef, useState } from "react"; // useRef 추가
import styles from "./ReviewCommentItem.module.css";
import Swal from "sweetalert2";

// ReviewCommentItem  (depth = 0, 일반 댓글)
const ReviewCommentItem = ({
  comment,
  replies = [], // 기본값: 빈 배열 (대댓글 없을 때 오류 방지)
  loginMemberId,
  onUpdate,
  onDelete,
  onReplyAdd,
}) => {
  // 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);
  // 수정 중인 내용 (초기값: 현재 댓글 내용)
  const [editContent, setEditContent] = useState(comment.content);

  // 답글 입력창 표시 여부
  const [showReplyInput, setShowReplyInput] = useState(false);
  // 대댓글 입력 내용
  const [replyContent, setReplyContent] = useState("");

  const editTextareaRef = useRef(null);
  const replyTextareaRef = useRef(null);

  // 수정 textarea 자동 높이 조정 (내용에 따라 늘어남)
  useEffect(() => {
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = "auto";
      editTextareaRef.current.style.height =
        editTextareaRef.current.scrollHeight + "px";
    }
  }, [editContent, isEditing]);

  // 대댓글 textarea 자동 높이 조정
  useEffect(() => {
    if (replyTextareaRef.current) {
      replyTextareaRef.current.style.height = "auto";
      replyTextareaRef.current.style.height =
        replyTextareaRef.current.scrollHeight + "px";
    }
  }, [replyContent]);

  // 댓글 수정
  // "수정" 클릭 → 편집 모드 진입
  // "완료" 클릭 → onUpdate 콜백 호출 후 편집 모드 종료
  const handleUpdate = () => {
    if (isEditing) {
      // 완료 버튼: 내용이 바뀐 경우만 API 호출
      if (editContent.trim() && editContent !== comment.content) {
        onUpdate(comment.commentNo, editContent);
      }
    }
    setIsEditing(!isEditing);
  };

  // 댓글 삭제
  // 삭제 시 해당 댓글의 대댓글도 DB CASCADE 로 함께 삭제됨
  const handleDelete = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "삭제 시 댓글과 답글이 모두 삭제됩니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(comment.commentNo);
      }
    });
  };

  // 대댓글 등록
  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReplyAdd(comment.commentNo, replyContent); // 부모 commentNo 전달
    setReplyContent(""); // 입력창 초기화
    setShowReplyInput(false); // 입력창 닫기
  };

  // 로그인 회원이 이 댓글의 작성자인지 확인
  const isOwner = loginMemberId === comment.memberId;

  return (
    <div className={styles.comment_wrap}>
      {/* 작성자 정보 + 수정/삭제 버튼 */}
      <div className={styles.comment_header}>
        {/* 프로필 + 이름 + 날짜 */}
        <div className={styles.writer}>
          <div
            className={
              comment.memberThumb
                ? styles.member_thumb_exists
                : styles.member_thumb
            }
          >
            {comment.memberThumb ? (
              <img
                src={`${import.meta.env.VITE_BACKSERVER}/matgot/member/${comment.memberThumb}`}
                alt="프로필"
              />
            ) : (
              // 프로필 이미지 없을 때 기본 아이콘
              <span className="material-icons">account_circle</span>
            )}
          </div>
          <span className={styles.comment_name}>{comment.writerName}</span>
          <span className={styles.comment_date}>{comment.createdAt}</span>
        </div>

        {/* 본인 댓글만 수정/삭제 버튼 표시 */}
        {isOwner && (
          <div
            className={styles.comment_btn_section}
            onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
          >
            <button className={styles.comment_btn} onClick={handleUpdate}>
              {isEditing ? "완료" : "수정"}
            </button>
            {/* 수정 중에는 삭제 버튼 숨김 */}
            {!isEditing && (
              <button className={styles.comment_btn} onClick={handleDelete}>
                삭제
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── 댓글 내용 ── */}
      <div className={styles.comment_content}>
        <textarea
          ref={editTextareaRef}
          className={styles.textarea}
          // 수정 모드: editContent / 읽기 모드: 서버 원본값 (state 변경 없이 보존)
          value={isEditing ? editContent : comment.content}
          onChange={(e) => setEditContent(e.target.value)}
          disabled={!isEditing} // 수정 모드가 아니면 읽기 전용
        />
      </div>

      {/* ── 답글 / 신고 버튼 ── */}
      <div className={styles.comment_actions}>
        {/* depth=0 댓글에만 답글 버튼 표시
            (depth=1 대댓글에는 이 컴포넌트 자체를 사용하지 않으므로
             ReplyItem 참조) */}
        <button
          type="button"
          className={styles.action_btn}
          onClick={() => setShowReplyInput(true)}
        >
          답글
        </button>
        <button
          type="button"
          className={`${styles.action_btn} ${styles.report_btn}`}
        >
          신고
        </button>
      </div>

      {/* ── 대댓글 입력창 (답글 버튼 클릭 시 표시) ── */}
      {showReplyInput && (
        <div className={styles.reply_input_wrap}>
          {/* 들여쓰기 구분선 */}
          <div className={styles.indent_line} />
          <div className={styles.reply_input}>
            <textarea
              ref={replyTextareaRef}
              className={styles.textarea}
              value={replyContent}
              placeholder="대댓글을 입력하세요"
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleReplySubmit();
                }
              }}
            />
            <div className={styles.reply_input_btns}>
              <button
                type="button"
                className={styles.cancel_btn}
                onClick={() => {
                  setShowReplyInput(false);
                  setReplyContent("");
                }}
              >
                취소
              </button>
              <button
                type="button"
                className={styles.submit_btn}
                onClick={handleReplySubmit}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 대댓글 목록 ── */}
      {replies.length > 0 && (
        <div className={styles.replies_wrap}>
          {replies.map((reply) => (
            <ReplyItem
              key={reply.commentNo}
              reply={reply}
              loginMemberId={loginMemberId}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReplyItem = ({ reply, loginMemberId, onUpdate, onDelete }) => {
  // 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);
  // 수정 중인 내용
  const [editContent, setEditContent] = useState(reply.content);

  const textareaRef = useRef(null);

  // textarea 자동 높이 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editContent, isEditing]);

  // 대댓글 수정
  const handleUpdate = () => {
    if (isEditing) {
      if (editContent.trim() && editContent !== reply.content) {
        onUpdate(reply.commentNo, editContent);
      }
    }
    setIsEditing(!isEditing);
  };

  // 대댓글 삭제
  const handleDelete = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "삭제 시 정보를 복구할 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(reply.commentNo);
      }
    });
  };

  const isOwner = loginMemberId === reply.memberId;

  return (
    <div className={styles.reply_wrap}>
      {/* 들여쓰기 구분선 — 대댓글임을 시각적으로 표시 */}
      <div className={styles.indent_line} />

      <div className={styles.reply_content_wrap}>
        {/* ── 작성자 정보 + 수정/삭제 ── */}
        <div className={styles.comment_header}>
          <div className={styles.writer}>
            <div
              className={
                reply.memberThumb
                  ? styles.member_thumb_exists
                  : styles.member_thumb
              }
            >
              {reply.memberThumb ? (
                <img
                  src={`${import.meta.env.VITE_BACKSERVER}/matgot/member/${reply.memberThumb}`}
                  alt="프로필"
                />
              ) : (
                <span className="material-icons">account_circle</span>
              )}
            </div>
            <span className={styles.comment_name}>{reply.writerName}</span>
            <span className={styles.comment_date}>{reply.createdAt}</span>
          </div>

          {isOwner && (
            <div
              className={styles.comment_btn_section}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.comment_btn} onClick={handleUpdate}>
                {isEditing ? "완료" : "수정"}
              </button>
              {!isEditing && (
                <button className={styles.comment_btn} onClick={handleDelete}>
                  삭제
                </button>
              )}
            </div>
          )}
        </div>

        {/* 대댓글 내용 */}
        <div className={styles.comment_content}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={isEditing ? editContent : reply.content}
            onChange={(e) => setEditContent(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* 답글 버튼 없음 — depth=1 은 대댓글을 달 수 없음 */}
        <div className={styles.comment_actions}>
          <button
            type="button"
            className={`${styles.action_btn} ${styles.report_btn}`}
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCommentItem;
