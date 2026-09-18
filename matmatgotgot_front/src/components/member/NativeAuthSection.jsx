import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './NativeAuthSection.module.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Input } from '../ui/Form';
import axios from 'axios';

function NativeAuthSection({check, memberInfo, native, setMemberInfo}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const memberId = memberInfo.memberId;
  const [count, setCount] = useState(0);

  useEffect(()=>{
    axios
     .get(`${import.meta.env.VITE_BACKSERVER}/members/natives/count`, {
        params: { memberId },
      })
      .then((res) => {
        console.log(res);
        if(res.data>0) {
          setCount(res.data);
        } else {
          setCount(null);
        }
      })
      .catch((error) => {
        console.error("서버 에러:", error);
        setCount(null);
      });
  },[memberId]);

  return (
    <div>
      <button className={styles.native_submit} onClick={() => setIsModalOpen(true)}>{check}</button>

      {isModalOpen && ReactDOM.createPortal(
      <div className={styles.modal_overlay}>
        <div className={styles.modal_content}>
            <h2>현지인 인증</h2>
            <button className={styles.xbutton} onClick={() => setIsModalOpen(false)}><CloseOutlinedIcon/></button>
          <div>
            <div>
              <p>현재주소</p>
              <p>{memberInfo.memberAddress}</p>
            </div>
            <div>
              <p>현지인 인증주소</p>
              <div>
                <Input
                  type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)
                  } />
                <div>
                  <button className={`${styles.native_submit} ${styles.native_addr_submit}`}>찾기</button>
                </div>
              </div>
            </div>
          </div>
          <button className={styles.native_certified_submit}>인증하기</button>
        </div>
      </div>,
      document.body // 2. 타겟을 document.body로 지정!
    )}
    </div>
  );
}

export default NativeAuthSection;