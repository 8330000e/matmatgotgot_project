import styles from './Style.module.css';

const Input = () => {
    return (<>
        <div className={styles.input_wrap}>
            <input className={styles.input} type="text"/>
        </div>
    </>);
};

export default Input;