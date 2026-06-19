import React, { useContext, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import About from "../about/About";

const Home = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [role]);

  return (
    <div className="home-container">
      <section className="hero-modern">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Upgrade Your Tech Life</h1>
          <p>Explore latest & trending electronics at unbeatable prices</p>
          <button onClick={() => navigate("/products")}>
            Shop Trending Now
          </button>
        </div>
      </section>

      <section className="benefits-section">
        <h2>Why Choose Us</h2>

        <div className="benefits-grid">
          <div className="benefit-card">
            <h4>Fast Shipping</h4>
            <p>Get products delivered quickly to your doorstep</p>
          </div>

          <div className="benefit-card">
            <h4>Secure Payments</h4>
            <p>100% secure payment protection</p>
          </div>

          <div className="benefit-card">
            <h4>Best Quality</h4>
            <p>Top brands you can trust</p>
          </div>

          <div className="benefit-card">
            <h4>Easy Returns</h4>
            <p>Hassle-free returns & exchanges</p>
          </div>
        </div>
      </section>

      <About />
      
    </div>
  );
};

export default Home;
