import axios from "axios";
import styles from "./JoinPage.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberNickname: "",
    memberEmail: "",
  });
  const [memberPwRe, setMemberPwRe] = useState("");
  const inputMember = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };
  const [mailAuth, setMailAuth] = useState(0);
  const [mailAuthCode, setMailAuthCode] = useState(null);
  const pwDupCheck = () => {
    const pw = document.getElementById("memberPw").value;
    const pwConfirm = document.getElementById("memberPwConfirm").value;
    if (pw !== pwConfirm) {
      alert("Passwords do not match.");
      return false;
    }
    return true;
  };
  const sendMail = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-verification`, {
        memberEmail: member.memberEmail,
      })
      .then((res) => {
        console.log(res);
        setMailAuthCode(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const joinMember = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members`, member)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Join</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          joinMember();
        }}
      >
        <label htmlFor="memberId">ID:</label>
        <input
          type="text"
          id="memberId"
          name="memberId"
          value={member.memberId}
          onChange={inputMember}
        />
        <br />
        <label htmlFor="memberPw">Password:</label>
        <input
          type="password"
          id="memberPw"
          name="memberPw"
          value={member.memberPw}
          onChange={inputMember}
        />
        <br />
        <label htmlFor="memberPwConfirm">Confirm Password:</label>
        <input
          type="password"
          id="memberPwConfirm"
          name="memberPwConfirm"
          value={memberPwRe}
          onChange={(e) => {
            setMemberPwRe(e.target.value);
          }}
        />
        <br />
        <label htmlFor="memberName">Name:</label>
        <input
          type="text"
          id="memberName"
          name="memberName"
          value={member.memberName}
          onChange={inputMember}
        />
        <br />
        <label htmlFor="memberName">Nickname:</label>
        <input
          type="text"
          id="memberNickname"
          name="memberNickname"
          value={member.memberNickname}
          onChange={inputMember}
        />
        <br />
        <label htmlFor="memberEmail">이메일</label>
        <div>
          <input
            type="text"
            name="memberEmail"
            id="memberEmail"
            value={member.memberEmail}
            onChange={inputMember}
            readOnly={mailAuth === 1 || mailAuth === 3}
          />
          <button
            type="button"
            className="btn primary sm"
            onClick={sendMail}
            disabled={mailAuth === 1 || mailAuth === 3}
          >
            메일전송
          </button>
        </div>
        <br />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Join;
