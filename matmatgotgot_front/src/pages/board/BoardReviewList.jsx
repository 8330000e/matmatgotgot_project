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
    return (<>
            <div className={styles.post}>
            <div>
                <div>
                    <p>{board.rest_name}</p>
                    <p><img src={starFill} /><img src={starFill} /><img src={starFill} /><img src={star} /><img src={star} /></p>
                </div>
                <div>{board.createDate && board.createDate.slice(0, 10)}</div>
            </div>
            <div>{board.reviewContent && board.reviewContent.slice(0, 52)}...</div>
            <div>
                <div>
                    <p><img src={heart} /> {board.boardLike}</p>
                    <p><img src={view} /> {board.boardView}</p>
                </div>
            </div>
            </div>
        </>
    );
};

export default BoardReviewList;