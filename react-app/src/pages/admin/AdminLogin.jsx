import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        `http://localhost:3000/users?email=${email}`
      );

      if (res.data.length === 0) {
        alert("Admin not found");
        return;
      }

      const user = res.data[0];

  
      if (user.role !== "admin") {
        alert("This is not an admin account");
        return;
      }

      
      if (user.password !== password) {
        alert("Invalid password");
        return;
      }

      
      login(user);

      navigate("/admin/dashboard", { replace: true });

    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto" }}>
      <form onSubmit={handleAdminLogin}>
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
};

export default AdminLogin;
