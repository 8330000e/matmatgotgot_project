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
  const [memberAddress, setMemberaddress] = useState(memberInfo.memberAddress);
  const [myReview, setMyreview] = useState(0);

  useEffect(()=>{
    axios
     .get(`${import.meta.env.VITE_BACKSERVER}/members/review/natives`, {
        params: { memberId, memberAddress },
      })
      .then((res) => {
        console.log(res);
        if(res.data != null) {
          setMyreview(res.data);
        } else {
          setMyreview(null);
        }
      })
      .catch((error) => {
        console.error("서버 에러:", error);
        setMyreview(null);
      });
  },[memberId]);

  const getGuGunSi = (addr) => {
    // 시, 구, 군으로 끝나는 모든 단어 추출
    const matches = addr.match(/[가-힣]+(?:시|구|군)/g);
    if (!matches) return '';

    // 첫 번째 단어가 '서울특별시', '경기도' 등 도/특별시/광역시인 경우 제외
    // (필요에 따라 인덱스 조정)
    setMemberaddress(matches.length > 1 ? matches.slice(1).join(' ') : matches[0])
  
    return memberAddress;
  }

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
              {/* <p>현지인 인증주소</p>
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
              </div> */}
            </div>
            <div>
              <p>내 {getGuGunSi(memberInfo.memberAddress)} 맛집 리뷰목록</p>
              <div>
                <ul className={styles.ulfirst}>
                  <li>NO</li>
                  <li>지역</li>
                  <li>맛집명</li>
                  <li>리뷰내용</li>
                  <li>작성일</li>
                </ul>
                <div>
                  <div className={styles.scroll_container}>
                {/* <ul>목록출력컴포넌트</ul> */}
                  <ul className={styles.ullist}>
                    <li>1</li>
                    <li>강서구</li>
                    <li>우주떡집</li>
                    <li>떡이 너무 맛...</li>
                    <li>26.10.30</li>
                  </ul>
                  <ul className={styles.ullist}>
                    <li>2</li>
                    <li>강서구</li>
                    <li>모퉁이김밥</li>
                    <li>김밥은 무조건...</li>
                    <li>26.12.11</li>
                  </ul>
                  <ul className={styles.ullist}>
                    <li>3</li>
                    <li>강서구</li>
                    <li>모퉁이김밥</li>
                    <li>김밥은 무조건...</li>
                    <li>26.12.11</li>
                  </ul>
                  <ul className={styles.ullist}>
                    <li>4</li>
                    <li>강서구</li>
                    <li>옆집떡볶이</li>
                    <li>떡볶이의 대가...</li>
                    <li>27.02.26</li>
                  </ul>
                  <ul className={styles.ullist}>
                    <li>5</li>
                    <li>강서구</li>
                    <li>된장찌개짱</li>
                    <li>제가 또 된장...</li>
                    <li>27.03.22</li>
                  </ul>
                  <ul className={styles.ullist}>
                    <li>6</li>
                    <li>강서구</li>
                    <li>빵지순례</li>
                    <li>미쳤습니다요즘...</li>
                    <li>27.03.31</li>
                  </ul>
                  <ul className={styles.ullist}>
                    <li>7</li>
                    <li>강서구</li>
                    <li>동양찻집</li>
                    <li>마음의 치유를...</li>
                    <li>27.04.02</li>
                  </ul>
                  </div>
                </div>
                {/* <ul>목록출력컴포넌트</ul> */}
              </div>
              <p>{}총 리뷰수가 5개 이하로 인증이 불가합니다.</p>
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