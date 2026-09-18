import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './NativeAuthSection.module.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

function NativeAuthSection({check}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button className={styles.native_submit} onClick={() => setIsModalOpen(true)}>{check}</button>

      {isModalOpen && ReactDOM.createPortal(
      <div className={styles.modal_overlay}>
        <div className={styles.modal_content}>
            <h2>현지인 인증</h2>
            <button className={styles.xbutton} onClick={() => setIsModalOpen(false)}><CloseOutlinedIcon/></button>
          <div>
            <p>현재 위치 정보를 기반으로 인증을 진행합니다.</p>
          </div>
          <button>인증하기</button>
        </div>
      </div>,
      document.body // 2. 타겟을 document.body로 지정!
    )}
    </div>
  );
}

export default NativeAuthSection;