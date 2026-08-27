import axios from "axios";
import styles from "./LoginPage.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import googlelogo from "../../assets/logo/google.svg";
import kakaologo from "../../assets/logo/kakao.svg";
import naverlogo from "../../assets/logo/naver.svg";
import { Input } from "../../components/ui/Form.jsx";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState({ memberId: "", memberPw: "" });
  
  const inputMember = (e) => {
    setMembers({ ...members, [e.target.name]: e.target.value });
  };

  // 일반로그인 상태
  const login = useAuthStore((state) => state.login);
  const memberId = useAuthStore((state) => state.memberId);
  const token = useAuthStore((state) => state.token);

  // 일반 로그인 핸들러
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/members/login`,
        {
          memberId: members.memberId,
          memberPw: members.memberPw,
        }
      );

      console.log("백엔드가 보내준 로그인 응답 데이터:", response.data);

      if (response.data) {
        login(response.data);
        Swal.mixin({
          toast: true,
          position: "top-end",
          topLayer: true,
          background: "#ffd95a",
          color: "#2b1b17",
          fontWeight: "600",
          iconColor: "#fff",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: "success",
          title: "로그인 성공",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
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
        title: "로그인 실패",
        text: "아이디 또는 비밀번호를 확인하세요.",
        icon: "error",
      });
    }
  };

  // 구글 로그인 시작
  const googleLogin = () => {
    const clientId = "648568970946-ifvq25nvtsg8np7c1984euvl65937a42.apps.googleusercontent.com"; 
    const redirectUri = "https://d2lg74d5mqmhqe.cloudfront.net/login/oauth2/code/google"; 
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email profile`;

    window.location.href = googleAuthUrl;
  };

  // 구글 로그인 콜백 처리
  const sendCodeToBackend = async (code) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/members/login/google`,
        { code: code },
        { withCredentials: true }
      );

      console.log("로그인 성공:", res.data);
      const googleUser = res.data;

      useAuthStore.getState().login({
        memberId: googleUser.memberId,         
        memberNickname: googleUser.memberNickname, 
        memberThumb: googleUser.memberThumb, 
        admin: googleUser.admin ?? false, 
        token: googleUser.token,              
        endTime: googleUser.validity || (new Date().getTime() + 3600000), 
      });

      navigate("/");
    } catch (err) {
      console.error("백엔드 전송 실패:", err);
      navigate("/login");
    }
  };

  // 구글 코드 감지 useEffect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // 현재 경로가 구글 콜백 경로이거나 code가 있을 때만 동작하도록 분기 처리가 안전합니다.
    if (code && window.location.pathname.includes("google")) {
      console.log("구글 인가 코드 획득:", code);
      sendCodeToBackend(code);
    }
  }, []);

  // 카카오 로그인 시작
  const KakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    if (!REST_API_KEY || !REDIRECT_URI) {
      throw new Error(".env 파일에서 환경변수를 불러오지 못했습니다.");
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = kakaoAuthUrl;
  };

  const getKakaoUserInfo = async (accessToken) => {
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("카카오 사용자 정보 API 응답:", response.data);
      
      const kakaoAccount = response.data.kakao_account || {};
      const kakaoProfile = kakaoAccount.profile || {};
      const properties = response.data.properties || {};

      // 이메일, 닉네임, 프로필 이미지 안전 추출
      const kakaoEmail = kakaoAccount.email || `kakao_${response.data.id}@social.com`;
      const kakaoNickname = kakaoProfile.nickname || properties.nickname || `사용자_${response.data.id}`;
      const kakaoThumb = kakaoProfile.thumbnail_image_url || properties.thumbnail_image || "";

      const requestData = {
        memberEmail: kakaoEmail,       
        memberNickname: kakaoNickname, 
        memberThumb: kakaoThumb        
      };

      console.log("백엔드로 보내는 최종 데이터:", JSON.stringify(requestData));

      // 백엔드 요청
      const res = await axios.post('/api/members/login/kakao', requestData);
      
      useAuthStore.getState().login({
        memberId: res.data.memberId,
        memberNickname: res.data.memberNickname || "카카오유저",
        memberThumb: res.data.memberThumb || null,
        admin: false,
        token: res.data.token,
        endTime: new Date().getTime() + 3600000,
      });

      navigate("/");
    } catch (error) {
      console.error("카카오 사용자 정보 가져오기 실패:", error);
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  const getKakaoToken = async (authorizeCode) => {
    try {
      const body = new URLSearchParams();
      body.append("grant_type", "authorization_code");
      body.append("client_id", import.meta.env.VITE_KAKAO_REST_API_KEY);
      body.append("redirect_uri", import.meta.env.VITE_KAKAO_REDIRECT_URI);

      if (import.meta.env.VITE_KAKAO_CLIENT_SECRET) {
        body.append("client_secret", import.meta.env.VITE_KAKAO_CLIENT_SECRET);
      }
      body.append("code", authorizeCode);

      const response = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      getKakaoUserInfo(response.data.access_token);
    } catch (error) {
      console.error("토큰 요청 실패:", error.response ? error.response.data : error.message);
      alert("카카오 로그인 인증에 실패했습니다.");
    }
  };

  // ⭐ useEffect 중복 실행 방지 Flag
  const isProcessed = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // 중복 실행 및 경로 체크
    if (code && window.location.pathname.includes("kakao") && !isProcessed.current) {
      isProcessed.current = true; // 락을 걸어서 두 번 실행 안 되도록 방지
      console.log("카카오 인가 코드 획득 성공:", code);
      getKakaoToken(code);
    }
  }, []);

  // 네이버 로그인
  const naverLogin = async () => {
    const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      import.meta.env.VITE_NAVER_REDIRECT_URI,
    );

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/members/ranchar`,
      );
      const STATE = response.data; 

      const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
      window.location.assign(NAVER_AUTH_URL);
    } catch (error) {
      console.error("🚨 백엔드에서 랜덤 문자열(state)을 가져오는데 실패했습니다:", error);
      alert("로그인 세션 생성 실패. 다시 시도해주세요.");
    }
  };

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const isCallbackMode = Boolean(code && window.location.pathname.includes("code"));

  console.log("아이디: ", memberId, "\n토큰: ", token);

  return (
    <>
      <div>
        {isCallbackMode ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <h3>소셜 로그인 처리 중입니다...</h3>
            <p>잠시만 기다려주세요.</p>
          </div>
        ) : (
          <div className={styles.wrap}>
            <h1>로그인</h1>
            <div className={styles.login_wrap}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                autoComplete="off"
              >
                <div>
                  <div className={styles.inputLabel}>
                    <label htmlFor="memberId">아이디</label>
                  </div>
                  <Input
                    type="text"
                    id="memberId"
                    name="memberId"
                    value={members.memberId}
                    onChange={inputMember}
                  />
                </div>

                <div>
                  <div className={styles.inputLabel}>
                    <label htmlFor="memberPw">비밀번호</label>
                  </div>
                  <Input
                    type="password"
                    id="memberPw"
                    name="memberPw"
                    value={members.memberPw}
                    onChange={inputMember}
                  />
                </div>
                <Link to={"/finding"}>
                  <div className={styles.idpw}>아이디/비밀번호 찾기</div>
                </Link>
                <button type="submit" className={styles.submit}>
                  로그인
                </button>
              </form>
              <div className={styles.social_wrap}>
                <p>소셜 로그인</p>
                <div className={styles.social}>
                  <button onClick={googleLogin}>
                    <img src={googlelogo} alt="google login" />
                  </button>
                  <button onClick={KakaoLogin}>
                    <img src={kakaologo} alt="kakaotalk login" />
                  </button>
                  <button onClick={naverLogin}>
                    <img src={naverlogo} alt="naver login" />
                  </button>
                </div>
              </div>
              <div className={styles.horizon}>
                <hr />
              </div>
              <div className={styles.signup}>
                <Link to={"/signup"}>
                  <p>아직 회원이 아니신가요?</p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;