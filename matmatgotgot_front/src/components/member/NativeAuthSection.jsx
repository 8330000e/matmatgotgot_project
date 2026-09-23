import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './NativeAuthSection.module.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Input } from '../ui/Form';
import axios from 'axios';
import apiClient from '../../api';

function NativeAuthSection({ check, memberInfo, native, setMemberInfo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myReview, setMyreview] = useState(0);

  const memberId = memberInfo?.memberId;

  // 1. pure 함수
  const parseGuGunSi = (addr) => {
    if (!addr) return '';
    const matches = addr.match(/[가-힣]+(?:시|구|군)/g);
    if (!matches) return '';
    return matches.length > 1 ? matches.slice(1).join(' ') : matches[0];
  };

  // 2. State 대신 렌더링 시점에 바로 계산 (Effect와 setState 불필요!)
  const address = parseGuGunSi(memberInfo?.memberAddress);

  // 3. API 호출 Effect는 그대로 유지 (address 변수를 직접 참조)
  useEffect(() => {
    if (!memberId || !address || address.trim() === "") {
      console.log("주소 정보가 아직 로드되지 않아 API 호출을 대기합니다.");
      return;
    }

    const fetchNatives = async () => {
      try {
        const response = await apiClient.get('/api/members/review/natives', {
          params: {
            memberId: memberId,
            address: address
          }
        });
        console.log(response);
        setMyreview(response.data);
      } catch (error) {
        console.error("서버 에러:", error);
      }
    };

    fetchNatives();
  }, [memberId, address]);

  return (
    <div>
      <button className={styles.native_submit} onClick={() => setIsModalOpen(true)}>{check}</button>

      {isModalOpen && ReactDOM.createPortal(
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <h2>현지인 인증</h2>
            <button className={styles.xbutton} onClick={() => setIsModalOpen(false)}><CloseOutlinedIcon /></button>
            <div>
              <div>
                <p>현재주소</p>
                <p>{memberInfo?.memberAddress}</p>
              </div>
              <div>
              </div>
              <div>
                {/* JSX에서는 순수 함수 호출만 수행 */}
                <p>내 {parseGuGunSi(memberInfo?.memberAddress)} 맛집 리뷰목록</p>
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
                    </div>
                  </div>
                </div>
                <p>총 리뷰수가 5개 이하로 인증이 불가합니다.</p>
              </div>
            </div>
            <button className={styles.native_certified_submit}>인증하기</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default NativeAuthSection;