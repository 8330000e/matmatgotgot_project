import { Link } from "react-router-dom";

const MainCover = () => {
    return(
        <>
            <div className="main">
                <div>
                    <section>
                        <h2>맛맛곳곳에 오신 것을 환영합니다!</h2>
                    </section>
                    <div>
                        <Link to="/login">Login</Link>
                    </div>
                    <div>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
        </>
    );
};
export default MainCover;