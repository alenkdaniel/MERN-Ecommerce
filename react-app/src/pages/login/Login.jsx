import React, { useContext, useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loginUser = async (e) => {
    e.preventDefault();

    const newError = { email: "", password: "" };

    if (!email) newError.email = "Email is required";
    if (!password) newError.password = "Password is required";

    if (newError.email || newError.password) {
      setError(newError);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;
      console.log(res.data);

      localStorage.setItem("token", token);

      login(user,token);

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError({ email: error.response.data.message, password: "" });
      } else {
        setError({ email: "Something went wrong", password: "" });
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={loginUser}>
        <h1>Login</h1>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="error-text">{error.email}</p>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="error-text">{error.password}</p>
        </div>

        <button className="login-btn" type="submit">
          Log in
        </button>

        <div className="register-path">
          <span>Don't have an account?</span>
          <button
            type="button"
            onClick={() => navigate("/register", { replace: true })}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
