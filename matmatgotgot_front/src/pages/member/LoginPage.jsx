import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState({ memberId: "", memberPw: "" });
  const inputMember = (e) => {
    setMembers({ ...members, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 일반로그인
  const login = useAuthStore((state) => state.login);
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
        navigate("/main");
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
        if (res.status === 200) {
          navigate("/main");
        }
      } catch (err) {
        console.error("백엔드 전송 실패:", err);
      }
    },
    onError: () => console.log("구글 로그인 실패"),
  });

  // 카카오톡 로그인
  const kakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.KAKAO_REDIRECT_URI}`;
    const kakaoCode = axios.get(kakaoAuthUrl).then((res) => {
      console.log("카카오 인가 코드:", res.data.code);
      // 백엔드 서버로 인가 코드 전송
      try {
        const res = axios.post(
          `${import.meta.env.VITE_BACKSERVER}/members/login/kakao`,
          { code: res.data.code },
          { withCredentials: true },
        );
        console.log("카카오 로그인 성공:", res.data);
        if (res.status === 200) {
          navigate("/main");
        }
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
      }
    });
  };

  // 네이버 로그인

  // 애플 로그인(상황에 따라 생략 가능성 높음)

  return (
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
      <button onClick={() => kakaoLogin()}>카카오톡으로 로그인하기</button>
    </div>
  );
};

export default Login;
