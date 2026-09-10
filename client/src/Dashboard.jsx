import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";
import logo from "./assets/bus-logo.jpeg";
import { Link } from "react-router-dom";

const images = {
  logo,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div className="dashboard-page">
        <header className="site-header">
          <div className="logo">
            <Link to="/dashboard">
              <img src={images.logo} className="img-logo" />
            </Link>
          </div>
          <div className="logout-box" onClick={handleLogout}>
            <h5 className="logout-text">Logout</h5>
          </div>
        </header>
        <main>
          <div className="dashboard-nav">
            <section className="dashboard-container">
              <div>
                <h1 className="admin-title">Admin Dashboard</h1>
              </div>
              <div>
                <Link to="/leads">
                  <button className="view-leads-btn">Leads</button>
                </Link>
              </div>
              <div>
                <Link to="/clients">
                  <button className="view-clients-btn">Clients</button>
                </Link>
              </div>
            </section>
          </div>
        </main>
        <footer className="footer-text-container">
          <p className="footer-text">© 2026 Database. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
