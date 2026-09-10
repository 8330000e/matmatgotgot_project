import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './NativeAuthSection.module.css';

function NativeAuthSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>동네 인증하기</button>

      {isModalOpen && ReactDOM.createPortal(
      <div className={styles.modal_overlay}>
        <div className={styles.modal_content}>
          <h2>동네 인증</h2>
          <p>현재 위치 정보를 기반으로 인증을 진행합니다.</p>
          <button onClick={() => setIsModalOpen(false)}>닫기</button>
        </div>
      </div>,
      document.body // 2. 타겟을 document.body로 지정!
    )}
    </div>
  );
}

export default NativeAuthSection;