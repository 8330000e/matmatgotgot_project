import axios from "axios";
// import styles from "./LoginPage.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [members, setMembers] = useState({ memberId: "", memberPw: "" });
  const inputMember = (e) => {
    setMembers({ ...members, [e.target.name]: e.target.value });
  };
  // const [isCallbackMode, setIsCallbackMode] = useState(false);

  // 일반로그인
  const login = useAuthStore((state) => state.login);
  const memberId = useAuthStore((state)=> state.memberId);
  const token = useAuthStore((state)=> state.token);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/members/login`,
        {
          memberId: members.memberId,
          memberPw: members.memberPw,
        },
      );

      console.log("백엔드가 보내준 로그인 응답 데이터:", response.data);

      // 백엔드에서 준 응답 데이터(memberId, token, memberNickname 등)
      if (response.data) {
        // 🔥 여기서 스토어의 login을 실행해야 localStorage에 "auth-key"가 생성됩니다!
        login(response.data);
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  // 구글 로그인
  const googleLogin = useGoogleLogin({
    // 구글로부터 '인가 코드(code)'를 받아오는 방식 설정
    flow: "auth-code",
    // ux_mode: "redirect",
    // redirect_uri: `${import.meta.env.VITE_FRONTSERVER}/login`,
    onSuccess: async (codeResponse) => {
      console.log("구글 인가 코드:", codeResponse.code);

      // 백엔드 서버로 인가 코드 전송
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKSERVER}/members/login/google`,
          { code: codeResponse.code },
          { withCredentials: true }, // 아까 설정한 쿠키 공유 옵션!
        );

        console.log("로그인 성공:", res.data);
        const googleUser = res.data;

        useAuthStore.getState().login({
          memberId: googleUser.id,              // 구글 이메일을 아이디로 활용
          memberNickname: googleUser.name,         // '김가연'
          memberThumb: googleUser.picture,         // 구글 프로필 이미지 URL
          admin: false,                            // 일반 유저
          token: token,     // 임시 세션 토큰 (백엔드 토큰 없을 시)
          endTime: new Date().getTime() + 3600000  // 타이머용 만료 시간 (지금으로부터 1시간 뒤 예시)
        });

        if (res.status === 200) {
          navigate("/");
        }
      } catch (err) {
        console.error("백엔드 전송 실패:", err);
      }
    },
    onError: () => console.log("구글 로그인 실패"),
  });

  // 카카오톡 로그인
  const KakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    if (!REST_API_KEY || !REDIRECT_URI) {
      throw new Error(".env 파일에서 환경변수를 불러오지 못했습니다.");
    }

    // 카카오 인증 페이지 URL
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}`;

    window.location.href = kakaoAuthUrl;
  };

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const isCallbackMode = Boolean(code);

  const getKakaoUserInfo = async (accessToken) => {
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      console.log("🎉 카카오 사용자 정보 획득:", response.data);

      const kakaoEmail = response.data.kakao_account?.email;
      const kakaoNickname = response.data.properties?.nickname;
      const kakaoThumb = response.data.properties?.thumbnail_image;

      if (kakaoEmail) {
        console.log("사용자 이메일:", kakaoEmail);
        console.log("사용자 닉네임:", kakaoNickname);
        console.log("사용자 프로필:", kakaoThumb);

        console.log(
          "🚀 백엔드로 보낼 준비 완료!"
        );

        // 우리 스프링 백엔드 서버로 POST 요청
        const res = await axios.post(
          `${import.meta.env.VITE_BACKSERVER}/members/login/kakao`,
          {
            memberEmail: kakaoEmail,
            memberNickname: kakaoNickname,
            memberThumb: kakaoThumb
          },
        );

        console.log("✅ 백엔드 응답 성공:", res.data);

        useAuthStore.getState().login({
          memberId: res.data.memberId,
          memberNickname: res.data.memberNickname || "카카오유저",
          memberThumb: res.data.memberThumb || null,
          admin: false,
          token: res.data.token,
          endTime: new Date().getTime() + 3600000 // 1시간 타이머
        });

        
        // 백엔드 데이터베이스 저장까지 정상 완료된 것을 확인하고 메인 홈으로 이동!
        navigate("/");
      } else {
        console.log(
          "이메일 정보가 없습니다. (카카오 로그인 시 이메일 동의 안 함)",
        );
        alert("이메일 제공 동의가 필요합니다.");
      }
    } catch (error) {
      console.error(
        "사용자 정보 요청 또는 백엔드 전송 실패:",
        error.response ? error.response.data : error.message,
      );
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };


  const getKakaoToken = async (authorizeCode) => {
    try {
      console.log("🔑 인가 코드로 토큰 요청 시작. 코드:", authorizeCode);

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
        },
      );

      console.log("🎉 카카오 토큰 발급 성공:", response.data);
     
      // 토큰을 정상적으로 받았으므로 다음 단계인 이메일/백엔드 전송 실행
      getKakaoUserInfo(response.data.access_token);
    } catch (error) {
      console.error(
        "토큰 요청 실패:",
        error.response ? error.response.data : error.message,
      );
      alert("카카오 로그인 인증에 실패했습니다.");
    }
  };

  useEffect(() => {
    // 2. useEffect 안에서는 setState를 호출하지 않고, 오직 '외부 API 호출(Side Effect)'만 수행합니다.
    if (code) {
      console.log("카카오 인가 코드 획득 성공:", code);
      getKakaoToken(code); // 토큰 요청 실행
    }
  }, []); // 의존성 배열을 비워두거나 [code]를 넣어 최초 1회만 실행되도록 격리

  

  // 네이버 로그인

  // 애플 로그인(상황에 따라 생략 가능성 높음)

  console.log("아이디: ", memberId, "\n토큰: ", token);

  return (
    <>
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        {isCallbackMode ? (
          // 주소창에 code가 있을 때 (토큰 요청 중인 빈 화면 상태)
          <div>
            <h3>카카오 로그인 처리 중입니다...</h3>
            <p>잠시만 기다려주세요.</p>
          </div>
        ) : (
          <div>
            <h1>Login</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              autoComplete="off"
            >
              <label htmlFor="memberId">Username:</label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={members.memberId}
                onChange={inputMember}
              />
              <br />
              <label htmlFor="memberPw">Password:</label>
              <input
                type="password"
                id="memberPw"
                name="memberPw"
                value={members.memberPw}
                onChange={inputMember}
              />
              <br />
              <button type="submit">Login</button>
            </form>
            <button onClick={() => googleLogin()}>구글로 로그인하기</button>
            <button onClick={KakaoLogin}>카카오톡으로 로그인하기</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
