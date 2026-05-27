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
  const login = useAuthStore((state) => state.login);
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKSERVER}/members/login`, {
        memberId: members.memberId,
        memberPw: members.memberPw
      });

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
  // const loginPage = () => {
  //   if (members.memberId === "" || members.memberPw === "") {
  //     return;
  //   }
  //   axios
  //     .post(`${import.meta.env.VITE_BACKSERVER}/members/login`, members, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       if (res.status === 200) {
  //         navigate("/main");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
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
    </div>
  );
};

export default Login;
