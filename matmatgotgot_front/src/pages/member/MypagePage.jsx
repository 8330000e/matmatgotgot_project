import { useAuthStore } from "../../store/useAuthStore";

const MypagePage = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="mypage">
      <button onClick={logout}>로그아웃</button>
      <h1>My Page</h1>
      <p>Welcome to your personal page!</p>
    </div>
  );
};

export default MypagePage;
