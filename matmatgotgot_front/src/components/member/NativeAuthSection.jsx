import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './NativeAuthSection.module.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

function NativeAuthSection({check, memberInfo, native, setNative}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(memberInfo, native);
  try {
    if (native && typeof native === "object") {
          setNative(null);
        }
  } catch {
    console.error("에러");
    setNative(null);
  }

  return (
    <div>
      <button className={styles.native_submit} onClick={() => setIsModalOpen(true)}>{check}</button>

      {isModalOpen && ReactDOM.createPortal(
      <div className={styles.modal_overlay}>
        <div className={styles.modal_content}>
            <h2>현지인 인증</h2>
            <button onClick={() => setIsModalOpen(false)}><CloseOutlinedIcon/></button>
          <div>
            <div>
              <p>현재주소</p>
              <p>{memberInfo.memberAddress}</p>
            </div>
            <div>
              <p>현지인 인증주소</p>
              <div>
                <input type="text" />
                <button>찾기</button>
              </div>
            </div>
          </div>
          <button className={`${styles.native_submit}` `${styles.native_certified_submit}`}>인증하기</button>
        </div>
      </div>,
      document.body // 2. 타겟을 document.body로 지정!
    )}
    </div>
  );
}

export default NativeAuthSection;