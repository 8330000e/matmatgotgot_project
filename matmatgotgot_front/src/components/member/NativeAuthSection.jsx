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
            <div>
              <p>내 ㅇㅇ구 맛집 리뷰목록</p>
              <div>
                <ul className={styles.ulfirst}>
                  <li>NO</li>
                  <li>지역</li>
                  <li>인증 기간</li>
                  <li>만료여부</li>
                </ul>
                {/* <ul>목록출력컴포넌트</ul> */}
                <ul className={styles.ullist}>
                  <li>1</li>
                  <li>종로구</li>
                  <li>2026.10.30 ~ 2027.04.30</li>
                  <li>유효</li>
                </ul>
                {/* <ul>목록출력컴포넌트</ul> */}
              </div>
              <p>총 리뷰수가 5개 이하로 인증이 불가합니다.</p>
            </div>
          </div>
          <button className={styles.native_certified_submit}>인증하기{/*인증가능or인증불가*/}</button>
        </div>
      </div>,
      document.body // 2. 타겟을 document.body로 지정!
    )}
    </div>
  );
}

export default NativeAuthSection;