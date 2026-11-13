
import "./Auth.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("auth/login.php", formData);

      if (response.data.success) {
        localStorage.setItem(
          "gifthub_user",
          JSON.stringify(response.data.data)
        );

        navigate("/");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-image-panel">
          <img
            src="/images/gifthub-auth.jpg"
            alt="Beautifully wrapped GiftHub present"
          />
        </div>

        <div className="auth-form-panel">
          <h2>Welcome Back!</h2>
          <p className="auth-subtitle">
            Login to your GiftHub account
          </p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
