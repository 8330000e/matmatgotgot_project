import { useState } from "react";
import ReviewCommentItem from "./ReviewCommentItem";
import styles from "./ReviewViewComment.module.css";
import axios from "axios";

const ReviewViewComment = () => {
  const { memberId } = useAuthStore();

  const [reviewComment, setReviewComment] = useState({
    reviewCommentContent: "",
    reviewCommentWriter: memberId,
    review: reviewNo,
  });

  const [reviewCommentList, setReviewCommentList] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/review/${reviewNo}/comments`)
      .then((res) => {
        setReviewCommentList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {reviewCommentList.map((comment, index) => {
        <ReviewCommentItem
          key={comment.reviewCommentNo}
          index={index}
          updateComment={updateComment}
          deleteComment={deleteComment}
        />;
      })}

      <div className={styles.input_item}>
        <textarea
          value={reviewComment}
          onChange={(e) => {
            setReviewComment({
              ...reviewComment,
              reviewCommentContent: e.target.value,
            });
          }}
        />
        <button className={styles.regist_btn} onClick={registComment}>
          등록
        </button>
      </div>
    </>
  );
};

export default ReviewViewComment;
