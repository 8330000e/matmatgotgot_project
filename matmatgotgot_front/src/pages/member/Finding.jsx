import styles from "./Finding.module.css";
import {useState} from "react";

const Finding = () => {
    const [click, setClick] = useState({
        left: true,
        right: false
    });
    const clicks = () => {
        setClick({
            left: click.right,
            right: click.left
        });
    };
    return (
        <div className={styles.wrap}>
            <div className={styles.finding_wrap}>
                <div className={styles.finding}>
                    <div onClick={clicks} className={click.left?`${styles.findingbase}`:`${styles.findingselect}`}>아이디 찾기</div>
                    <div onClick={clicks} className={click.right?`${styles.findingbase}`:`${styles.findingselect}`}>비밀번호 찾기</div>
                </div>
                <div>
                    <div className={styles.id_wrap}></div>
                    <div className={styles.pw_wrap}></div>
                </div>
            </div>
        </div>
    );
};

export default Finding;