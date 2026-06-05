import styles from "./MypagePage.module.css";
import { useAuthStore } from '../../store/useAuthStore';
import {Link, useLocation, useNavigate} from "react-router-dom";
import defaultImg from "../../assets/img/defaultImg.svg";
import changeImg from "../../assets/img/changeImg.svg";
import native from "../../assets/img/native.svg";
import nativeIcon from "../../assets/img/nativeIcon.svg";
import navigate from "../../assets/img/navigate.svg";
import google from "../../assets/logo/google.svg";
import kakao from "../../assets/logo/kakao.svg";
import naver from "../../assets/logo/naver_green.svg";
import check from "../../assets/img/check.svg";
import checked from "../../assets/img/checked.svg";
import axios from "axios";
import {useEffect, useState} from "react";

export const MypagePage = () => {
   const location = useLocation();
   const logout = useAuthStore((state) => state.logout);
   const path = location.pathname.substring(8);
    const { memberId, token } = useAuthStore();
    const [memberInfo, setMemberInfo] = useState(null);
    useEffect(() => {
        // 💡 가드 조건 강화: memberId와 token이 '둘 다 확실히 존재할 때만' 요청을 보냅니다.
        if (memberId && memberId !== "null" && token) {

            console.log("🚀 인증 토큰과 함께 회원정보 요청 중...", token);

            axios.get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`, {
                // 💡 중요: 헤더에 Bearer 토큰을 직접 수동으로 꽂아줍니다.
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    console.log("✅ 회원정보 로드 성공:", res.data);
                    setMemberInfo(res.data);
                })
                .catch((err) => {
                    console.error("🚨 회원정보 로드 실패:", err);
                });

        } else {
            console.log("⏳ 아직 memberId나 token이 준비되지 않아 요청을 대기합니다.");
        }
    }, [memberId, token]);
   const imgChange = () => {
    return null;
  };

  return (
    <div className="mypage">
      <button onClick={logout}>로그아웃</button>

        <div className={styles.mypage_wrap}>
            <div className={styles.sidebar_wrap}>
                <div>
                    <div className={styles.mypagetxt}>
                        마이페이지
                    </div>
                    <ul className={styles.menubar_wrap}>
                        <Link to="/mypage/myinfo">
                            <li className={path === "myinfo" ? styles.sidebar_active : styles.sidebar_default}>
                            내 정보
                            </li>
                        </Link>
                        <Link to="/mypage/myreview">
                            <li className={path === "myreview" ? styles.sidebar_active : styles.sidebar_default}>
                            내 리뷰
                            </li>
                        </Link>
                        <Link to="/mypage/zzim">
                            <li className={path === "zzim" ? styles.sidebar_active : styles.sidebar_default}>
                            찜한 맛집 목록
                            </li>
                        </Link>
                        <Link to="/mypage/matzip">
                            <li className={path === "matzip" ? styles.sidebar_active : styles.sidebar_default}>
                           맛집 여행 목록
                            </li>
                        </Link>
                        <Link to="/mypage/likeposts">
                            <li className={path === "likeposts" ? styles.sidebar_active : styles.sidebar_default}>
                            좋아요 게시글
                            </li>
                        </Link>
                        <Link to="/mypage/myposts">
                            <li className={path === "myposts" ? styles.sidebar_active : styles.sidebar_default}>
                            내 게시글
                            </li>
                        </Link>
                        <Link to="/mypage/reportposts">
                            <li className={path === "reportposts" ? styles.sidebar_active : styles.sidebar_default}>
                            신고 게시글
                            </li>
                        </Link>
                        <Link to="/mypage/myask">
                            <li className={path === "myask" ? styles.sidebar_active : styles.sidebar_default}>
                            1:1 문의 내역
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className={styles.content_wrap}>
                {path === "myinfo" && <Myinfo memberInfo={memberInfo} />}
                {path === "myreview" && <Myreview />}
                {path === "zzim" && <Zzim />}
                {path === "matzip" && <Matzip />}
                {path === "likeposts" && <Likeposts />}
                {path === "myposts" && <Myposts />}
                {path === "reportposts" && <Reportposts />}
                {path === "myask" && <Myask />}
            </div>
        </div>
    </div>
  );
};

export const Myinfo = ({ memberInfo }) => {
    if (!memberInfo) {
        return <div style={{ padding: "50px", textAlign: "center" }}>회원 정보를 불러오는 중입니다...</div>;
    }
    return (<>
        <div className={styles.content_menu_wrap}>
            <div className={styles.info_profile}>
                <div>
                    <img src={changeImg} alt="" className={styles.changeImg} onClick={()=>imgChange()}/>
                    <img src={defaultImg} alt="" className={styles.defaultImg}/>
                </div>
                <div>
                    <div>
                        <div className={styles.info_nick}>{memberInfo.memberNickname}</div>
                        <div><img src={native} /></div>
                    </div>
                    <ul className={styles.info_member}>
                        <li>
                            <img src={navigate} alt=""/>
                            <div>{memberInfo.memberAddress}</div>
                        </li>
                        <li>
                            <img src={nativeIcon} alt=""/>
                            <div>현지인 인증됨</div>
                        </li>
                        <li>
                            2026.06.04 ~ 2026.12.04
                        </li>
                    </ul>
                </div>
                <div className={styles.profile_submit}>
                    <button type="submit" className={styles.submit}>프로필 수정</button>
                </div>
            </div>
            <div className={styles.info_2line}>
                <div>
                    <div className={styles.info_email}>
                        <div>
                            <p className={styles.info_title}>이메일</p>
                            <p>{memberInfo.memberEmail}</p>
                        </div>
                        <div>
                            <button type="submit" className={styles.submit}>이메일 변경</button>
                        </div>
                    </div>
                    <div className={styles.info_pwchange}>
                        <p className={styles.info_title}>비밀번호 변경</p>
                        <button type="submit" className={styles.submit}>비밀번호 변경</button>
                    </div>
                </div>
                <div className={styles.info_alarm}>
                    <p className={styles.info_title}>알림설정</p>
                    <div>
                        <ul>
                            <li>앱 푸시 알람 수신 동의</li>
                            <li>이메일 알림 수신 동의</li>
                            <li>마케팅 정보 수신 동의</li>
                        </ul>
                        <div>
                            <label htmlFor="appPush"><img src={check} /></label>
                            <label htmlFor="emailAlarm"><img src={check} /></label>
                            <label htmlFor="emailAlarm"><img src={check} /></label>
                            <input type="checkbox" name="appPush" id="appPush" className={styles.inputHidden}/>
                            <input type="checkbox" name="emailAlarm" id="emailAlarm" className={styles.inputHidden}/>
                            <input type="checkbox" name="marketing" id="marketing" className={styles.inputHidden}/>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className={styles.submit}>알림설정 수정</button>
                    </div>
                </div>
            </div>
            <div className={styles.info_3line}>
                <div className={styles.info_social}>
                    <p className={styles.info_title}>소셜 계정 연동</p>
                    <ul>
                        <li><img src={google} /><span>구글 계정 연동하기</span></li>
                        <li><img src={kakao} /><span>카카오 계정 연동하기</span></li>
                        <li><img src={naver} /><span>네이버 계정 연동하기</span></li>
                    </ul>
                </div>
                <div className={styles.info_delete}>
                    <p className={styles.info_title}>회원탈퇴</p>
                    <div>
                        <p>맛맛곳곳에 저장된 기록들이 전부 삭제되며 해당 계정으로 다시 로그인 할 수 없습니다.</p>
                        <p>동의하십니까?</p>
                    </div>
                    <div>
                        <button type="submit" className={styles.submit_d}>회원 탈퇴</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export const Myreview = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Zzim = () => {
    return (<>
        <div className={styles.content_menu_wrap}>
            <div>우우우</div>
        </div>
    </>);};

export const Matzip = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Likeposts = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Myposts = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Reportposts = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};

export const Myask = () => {
    return (<>
        <div className={styles.content_menu_wrap}>

        </div>
    </>);};


export default { MypagePage, Myinfo, Myreview, Zzim, Matzip, Likeposts, Myposts, Reportposts, Myask };
