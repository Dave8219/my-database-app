import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import "./login.css";
import logo from "./assets/bus-logo.jpeg";

const images = {
  logo,
};

const Login = () => {
  /*
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
*/

  const [recoveryMode, setRecoveryMode] = useState(null);
  // null | "password" | "username"

  const [recoveryEmail, setRecoveryEmail] = useState("");

  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/auth/forgot-password`,
        {
          email: recoveryEmail,
        },
      );

      setMessage(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not send reset email");
    }
  };

  const handleForgotUsername = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/auth/forgot-username`,
        {
          email: recoveryEmail,
        },
      );

      setMessage(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not recover username");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/auth/login`,
        loginForm,
        {
          withCredentials: true, // IMPORTANT for httpOnly cookie
        },
      );

      console.log(response.data);

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);

      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="login-page">
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
        <main className="admin-container">
          <div>
            <h1 className="admin-title">Admin</h1>
          </div>

          <div className="form-group-container">
            <div className="form-group">
              <h4 className="form-label">Username</h4>
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <h4 className="form-label">Password</h4>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          </div>
          <div>{message && <p className="error-login-msg">{message}</p>}</div>

          <div>
            <button
              className="forgot-btn"
              onClick={() =>
                setRecoveryMode(recoveryMode === "password" ? null : "password")
              }
            >
              Forgot Password
            </button>
            <button
              className="forgot-btn"
              onClick={() =>
                setRecoveryMode(recoveryMode === "username" ? null : "username")
              }
            >
              Forgot Username
            </button>
          </div>

          {recoveryMode === "password" && (
            <div className="forgot-password-container">
              <h4 className="forgot-title">Reset Password</h4>

              <input
                type="email"
                placeholder="Enter your email address"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="forgot-input"
              />

              <button className="reset-btn" onClick={handleForgotPassword}>
                Send Reset Link
              </button>
            </div>
          )}

          {recoveryMode === "username" && (
            <div className="forgot-password-container">
              <h4 className="forgot-title">Recover Username</h4>

              <input
                type="email"
                placeholder="Enter your email address"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="forgot-input"
              />

              <button className="reset-btn" onClick={handleForgotUsername}>
                Email My Username
              </button>
            </div>
          )}

          <div>
            <Link to="/create-account">
              <h4 className="create-account-h4">Create Account</h4>
            </Link>
          </div>

          {/*
          <div>
            <button className="create-btn">Create Account</button>
          </div>
          */}
        </main>
        <footer className="footer-banner">
          <p className="footer-text">© 2026 Database. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Login;
