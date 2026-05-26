import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const login = () => {
    if (members.memberId === "" || members.memberPw === "") {
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/login`, members, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
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
    </div>
  );
};

export default Login;
