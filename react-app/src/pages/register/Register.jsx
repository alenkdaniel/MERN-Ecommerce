import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

 
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",{
          name,
          email,
          password
        }
      );


     toast.success(res.data.message || "Registration successful! Please login.");
    

      navigate("/login");

    } catch (error) {
        console.log("FULL ERROR:", error);
  console.log("RESPONSE:", error.response);
  console.log("DATA:", error.response?.data);
      
       if (error.response && error.response.data.message) {
         setError(error.response.data.message);
    }else{
      setError("Something went wrong");
    }
  } finally {
      setLoading(false);
  }
}
  

  return (
    <div className="regpage-container">
      <form className="regpage" onSubmit={registerUser}>
        <h1>Registration Form</h1>

        <div className="reg-name">
          <label>Username</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="reg-email">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="reg-password">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="reg-btn">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </div>

        <div className="login-path">
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};


export default Register;
