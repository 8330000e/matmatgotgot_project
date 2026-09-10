import styles from "./BoardReviewList.module.css";
import {useNavigate} from "react-router-dom";
import comment from "../../assets/img/comment.svg";
import heart from "../../assets/img/heart.svg";
import view from "../../assets/img/view.svg";
import star from "../../assets/img/start.svg";
import starFill from "../../assets/img/starFILL.svg";

const BoardReviewList = ({ myboard }) => {
    return (
        <ul className={styles.board_list_wrap}>
            {myboard.map((board, i) => (
                <BoardItem key={`board-${board.boardNo}`} board={board} no={i+1} />
            ))}
        </ul>
    );
};

const BoardItem = ({ board, no }) => {
    const navigate = useNavigate();
    const items = [];
    const rating = () => {
        for (var i = 0; i < board.rating; i++) {
            items.push(
                    <img src={starFill} alt="starFill" key={`${board.boardNo}-starFill-${i}`} />
            );
        }
        for (var j = 5-board.rating; j > 0; j--) {
            items.push(
                    <img src={star} alt="star" key={`${board.boardNo}-star-${i}`} />
            );
        }

        return items;
    };

    return (
        <>
            <div className={styles.post}>
                <a href={`https://d2lg74d5mqmhqe.cloudfront.net/rest/review/view/${board.restNo}`}>
                <div className={styles.number}>{no}.</div>
                <div className={styles.posts}>
                    <div>
                        <p>{board.restName}</p>
                        <p>{rating()}</p>
                        {/* <p><img src={starFill} /><img src={starFill} /><img src={starFill} /><img src={star} /><img src={star} /></p> */}
                    </div>
                    <div>{board.createdAt && board.createdAt.slice(0, 10)}</div>
                    <div>{board.reviewContent && board.reviewContent.slice(0, 52)}...</div>
                    <div>
                        <p><img src={heart} /> {board.boardLike}</p>
                    </div>
                </div>
                 </a>
            </div>
        </>
    );
};

export default BoardReviewList;