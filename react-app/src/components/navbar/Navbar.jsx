import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "react-bootstrap/Button";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="modern-nav">

      <div className="nav-left">
        <Link to="/" className="brand-logo">DIGIMART</Link>
      </div>

      <div className={`nav-center ${menuOpen ? "active" : ""}`}>
        {role !== "admin" && <Link to="/">Home</Link>}
        {role !== "admin" && <Link to="/about">About</Link>}
        {role !== "admin" && <Link to="/products">Products</Link>}

        {role === "admin" && <Link to="/admin/dashboard">Admin Panel</Link>}

        {isAuthenticated && role !== "admin" && <Link to="/cart">Cart</Link>}
        {isAuthenticated && role !== "admin" && <Link to="/orders">Orders</Link>}
        
      </div>

      <div className="nav-right">
        {!isAuthenticated ? (
          <Button onClick={() => navigate("/login")}>Login</Button>
        ) : (
          <Button onClick={handleLogout}>Logout</Button>
        )}
      </div>

      {/* MOBILE MENU ICON */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

    </nav>
  );
};

export default Navbar;
