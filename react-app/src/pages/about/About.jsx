import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">

  
      <section className="about-hero">
        <h1>About Us</h1>
        <p>
          We are a trusted provider of high-quality electronic products designed
          to simplify everyday life and enhance modern living.
        </p>
      </section>

  
      <section className="about-content">

        
        <div className="about-card">
          <h2>Who We Are</h2>
          <p>
           We are a customer-focused electronics brand offering smartphones, laptops, TVs, and essential home appliances. Our products are selected for performance, durability, and long-term value.
          </p>
        </div>

    
        <div className="about-card">
          <h2>Our Product Range</h2>
          <ul>
            <li>Smartphones with powerful performance</li>
            <li>Laptops for work and study</li>
            <li>Smart & LED TVs for entertainment</li>
            <li>Efficient iron boxes</li>
            <li>Energy-saving water heaters</li>
            <li>Essential home electronics</li>
          </ul>
        </div>

      
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            Our mission is to make modern technology accessible to everyone through reliable, safe, and high-performance electronic products.
          </p>
        </div>

      
        <div className="about-card">
          <h2>Our Values</h2>
          <ul>
            <li>Quality products</li>
            <li>Customer trust</li>
            <li>Innovation</li>
            <li>Reliability</li>
            <li>Transparency</li>
          </ul>
        </div>

    
        <div className="about-card">
          <h2>Why Choose Us</h2>
          <p>
           We provide trusted electronics designed for daily life, combining quality, safety, and dependable service you can rely on.
          </p>
        </div>

      </section>

    </div>
  );
};

export default About;
