import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './NativeAuthSection.module.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Input } from '../ui/Form';
import axios from 'axios';
import apiClient from '../../api';
import Swal from 'sweetalert2';

function NativeAuthSection({ check, memberInfo, native, setMemberInfo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myReview, setMyreview] = useState(0);
  const [reviewList, setReviewList] = useState([]);

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
        const response = await apiClient.get('/members/review/natives', {
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

  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKSERVER}/members/review`, {
      params: memberId
    }).then((res)=>{
      console.log(res);
      setReviewList(res.data);
    }).catch((err)=>{
      console.log(err);
    });
  },[memberId]);

  const certified = () => {
    axios.post(`${import.meta.env.VITE_BACKSERVER}/members/native/certified`, {
      params: memberId
    }).then((res)=>{
      console.log(res);
      if(res.data > 0) {
        Swal.mixin({
          toast: true,
          color: "#2b1b17",
          borderRadius: "15px",
          fontWeight: "800",
          padding: "20px 10px",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          title: "현지인 인증 완료",
          text: "현지인 인증이 완료 되었습니다..",
          icon: "success",
        });
      }
    }).catch((err)=>{
      console.log(err);
      Swal.mixin({
        toast: true,
        color: "#2b1b17",
        borderRadius: "15px",
        fontWeight: "800",
        padding: "20px 10px",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).fire({
        title: "현지인 인증 실패",
        text: "현지인 인증이 실패했습니다.",
        icon: "error",
      });
    })
  };

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
                      {reviewList.map((review,i)=>(
                        <ul key={`myreview-${review.reviewNo}`} className={styles.ullist}>
                          <li>{i+1}</li>
                          <li>{address}</li>
                          <li>{review.restName}</li>
                          <li>{review.reviewContent}</li>
                          <li>{review.createdAt? review.createdAt.slice(2, 10).replace(/-/g, '.') : ''}</li>
                        </ul>
                      ))}                      
                    </div>
                  </div>
                </div>
                {reviewList.length > 4 ? <p className={`${styles.reviewcount} ${styles.false}`}>총 리뷰수가 5개 이하로 인증이 불가합니다.</p> : <p className={`${styles.reviewcount} ${styles.success}`}>총 리뷰수가 5개 이상으로 인증이 가능합니다.</p>}
              </div>
            </div>
            <button className={`${styles.native_certified_submit} ${reviewList.length > 4 ? `${styles.certified}` : `${styles.certifiedfalse}`}`} {`${reviewList.length > 4 ? onClick={certified} : null}`}>인증하기</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default NativeAuthSection;