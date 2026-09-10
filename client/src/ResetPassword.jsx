import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./reset-password.css";
// import logo from "./assets/barrera-logo-no-background.png";
/*
const images = {
  logo,
};
*/
const ResetPassword = () => {
  const { token } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`${API_URL}/api/v1/auth/verify-reset-token/${token}`);
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [API_URL, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return alert("Please fill out all fields.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      await axios.patch(`${API_URL}/api/v1/auth/reset-password/${token}`, {
        password,
      });

      setSuccess(true);
    } catch (err) {
      alert("Unable to reset password.");
    }
  };

  if (loading) {
    return (
      <div className="reset-page">
        <h2>Verifying reset link...</h2>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="reset-page">
        <div className="reset-card">
          <h2>Reset Link Expired</h2>

          <p>This password reset link is invalid or has expired.</p>

          <Link to="/login">
            <button className="reset-btn">Return to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reset-page">
        <div className="reset-card">
          <h2>Password Reset Successful</h2>

          <p>Your password has been updated successfully.</p>

          <Link to="/login">
            <button className="reset-btn">Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="reset-page">
        <div className="reset-card">
          <h1>Reset Password</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className="reset-btn" type="submit">
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <footer>
        <p className="footer-text-reset-page">
          © 2026 Database Sample. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default ResetPassword;
