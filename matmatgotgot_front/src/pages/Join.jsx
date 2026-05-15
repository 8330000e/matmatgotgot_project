const Join = () => {
  return (
    <div>
      <h1>Join</h1>
      <form>
        <label htmlFor="memberId">ID:</label>
        <input type="text" id="memberId" name="memberId" />
        <br />
        <label htmlFor="memberPw">Password:</label>
        <input type="password" id="memberPw" name="memberPw" />
        <br />
        <label htmlFor="memberPwConfirm">Confirm Password:</label>
        <input type="password" id="memberPwConfirm" name="memberPwConfirm" />
        <br />
        <label htmlFor="memberName">Name:</label>
        <input type="text" id="memberName" name="memberName" />
        <br />
        <label htmlFor="memberEmail">Email:</label>
        <input type="email" id="memberEmail" name="memberEmail" />
        <br />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Join;
