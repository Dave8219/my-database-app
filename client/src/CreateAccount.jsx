import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./create-account.css";
import logo from "./assets/bus-logo.jpeg";

const images = {
  logo,
};

const CreateAccount = () => {
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = Object.fromEntries(formData);

    setLoading(true); // start loading
    setMessage(""); // clear previous message
    try {
      /* 
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/create-account`,
        newUser,
      );
      */

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/create-account`,
        newUser,
      );

      setMessage(res.data.msg || "Account created Successfully!");
      // use reset() only to clear the input fields after entry. Not necessary in this case...
      // e.currentTarget.reset();

      // Optionally redirect user to login after short delay
      setTimeout(() => navigate("/login"), 2000);
      console.log(newUser);
      setValue(value + 1);
    } catch (error) {
      console.error("Error response:", error.response);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again",
      );
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <>
      <div className="create-account-page">
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

        <main>
          <h1>Create Account</h1>
        </main>

        <section>
          <form className="create-account-container" onSubmit={handleSubmit}>
            <div className="form-group-container-ca">
              <div className="form-group-ca">
                <h4 className="form-label-ca">Username</h4>
                <input type="text" name="username" required />
              </div>
              <div className="form-group-ca">
                <h4 className="form-label-ca">Password</h4>
                <input type="password" name="password" required />
              </div>
              <div className="form-group-ca">
                <h4 className="form-label-ca">Email</h4>
                <input type="email" name="email" required />
              </div>
            </div>
            <div className="create-btn-container">
              <button className="submit-btn-ca" type="submit">
                {loading ? "Creating Account..." : "Submit"}
              </button>
              {message && (
                <p style={{ marginTop: "10px" }} className="error-message">
                  {message}
                </p>
              )}
            </div>
          </form>
        </section>

        <footer>
          <p className="footer-text">© 2026 Database. All rights reserved.</p>
        </footer>
      </div>
      ;
    </>
  );
};

export default CreateAccount;
