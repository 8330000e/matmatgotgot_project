import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      axios.post(
        `${import.meta.env.VITE_BACKSERVER}/members/login/google`,
        { code: code },
        { withCredentials: true }
      ).then(res => {
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
      }).catch(err => {
        console.error("구글 로그인 백엔드 전송 실패:", err);
        navigate("/login");
      });
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "100px 0" }}>
      <h3>구글 로그인 처리 중입니다...</h3>
    </div>
  );
}