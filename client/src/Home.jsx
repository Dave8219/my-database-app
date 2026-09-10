import "./home.css";
import { Link, useLocation } from "react-router-dom";
import logo from "./assets/bus-logo.jpeg";

const images = {
  logo,
};

const Home = () => {
  return (
    <>
      <header className="site-header">
        <div className="logo">
          <Link to="/login">
            <img src={images.logo} className="img-logo" />
          </Link>
        </div>

        <div className="tagline">
          <h5>Helping you today for the future!</h5>
        </div>
      </header>
      <div className="welcome-container">
        <h1>Welcome to the Home Page</h1>
        <Link to="/dashboard" className="dashboard-link">
          Dashboard
        </Link>
      </div>
    </>
  );
};

export default Home;
