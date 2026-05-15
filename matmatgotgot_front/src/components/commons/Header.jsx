import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div>
        <h1>맛맛곳곳</h1>
      </div>
      <div>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default Header;
